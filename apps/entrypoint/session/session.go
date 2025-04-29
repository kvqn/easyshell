package session

import (
	"bufio"
	"encoding/json"
	"entrypoint/daemon"
	"fmt"
	"io"
	"math/rand"
	"net"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var (
	cmd    *exec.Cmd
	stdin  io.WriteCloser
	stdout io.ReadCloser
	stderr io.ReadCloser
	locked bool
)

type response struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
}

type errorResponse struct {
	Critical bool   `json:"critical"`
	Message  string `json:"message"`
	Error    string `json:"error"`
}

func randomDelimiter() string {
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, 128)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func writeOrPanic(w io.Writer, data string) {
	_, err := w.Write([]byte(data))
	if err != nil {
		panic(err)
	}
}

func closeLock() {
	// TODO: critical log if not locked
	locked = false
}

func run(w http.ResponseWriter, r *http.Request) {
	if locked {
		w.WriteHeader(http.StatusLocked)
		if json.NewEncoder(w).Encode(errorResponse{
			Critical: false,
			Message:  "container locked",
			Error:    "",
		}) != nil {
			panic("couldn't write error response")
		}
		return
	}
	locked = true
	defer closeLock()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		if json.NewEncoder(w).Encode(errorResponse{
			Critical: true,
			Message:  "couldn't read request body",
			Error:    err.Error(),
		}) != nil {
			panic("couldn't write error response")
		}
		return
	}

	input := string(body)
	delimiter := randomDelimiter()

	var read_stdout, read_stderr string
	stdoutReader := bufio.NewReader(stdout)
	stderrReader := bufio.NewReader(stderr)
	// escapedInput := strings.ReplaceAll(input, "'", "'\\''")

	writeOrPanic(stdin, input+"\n")
	writeOrPanic(stdin, "echo "+delimiter+"\n")
	writeOrPanic(stdin, "echo >&2 "+delimiter+"\n")

	for {
		_read_stdout, err := stdoutReader.ReadByte()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			if json.NewEncoder(w).Encode(errorResponse{
				Critical: true,
				Message:  "couldn't read stdout",
				Error:    err.Error(),
			}) != nil {
				panic("couldn't write error response")
			}
			return
		}

		if _read_stdout != 0 {
			read_stdout += string(_read_stdout)
			if strings.HasSuffix(read_stdout, delimiter+"\n") {
				read_stdout = read_stdout[:len(read_stdout)-len(delimiter)-1]
				break
			}
		}

	}

	for {
		_read_stderr, err := stderrReader.ReadByte()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			if json.NewEncoder(w).Encode(errorResponse{
				Critical: true,
				Message:  "couldn't read stderr",
				Error:    err.Error(),
			}) != nil {
				panic("couldn't write error response")
			}
			return
		}

		if _read_stderr != 0 {
			read_stderr += string(_read_stderr)
			if strings.HasSuffix(read_stderr, delimiter+"\n") {
				read_stderr = read_stderr[:len(read_stderr)-len(delimiter)-1]
				break
			}
		}

	}

	response := response{
		Stdout: read_stdout,
		Stderr: read_stderr,
	}

	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		if json.NewEncoder(w).Encode(errorResponse{
			Critical: true,
			Message:  "couldn't form response",
			Error:    err.Error(),
		}) != nil {
			panic("couldn't write error response")
		}
		return
	}
}

func Main() {

	SOCKET_PATH := "/tmp/easyshell/main.sock"

	if _, err := os.Stat(SOCKET_PATH); err == nil {
		fmt.Printf("Removing existing socket file: %s\n", SOCKET_PATH)
		os.Remove(SOCKET_PATH)
	}

	go daemon.Run()

	cmd = exec.Command("sh")
	cmd.Dir = "/home"

	stdin, _ = cmd.StdinPipe()
	stdout, _ = cmd.StdoutPipe()
	stderr, _ = cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		panic("Error while cmd.Start() : " + err.Error())
	}

	go func() {
		err := cmd.Wait()
		if err != nil {
			panic("Error while cmd.Wait() : " + err.Error())
		}
		panic("Subprocess Ended")
	}()

	socket, err := net.Listen("unix", SOCKET_PATH)
	if err != nil {
		panic("Error while creating socket : " + err.Error())
	}
	defer socket.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/", run)
	server := http.Server{
		Handler: mux,
	}
	err = server.Serve(socket)
	if err != nil {
		panic("Error while serving : " + err.Error())
	}
}
