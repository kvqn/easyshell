package submission

import (
	"bytes"
	"encoding/json"
	"entrypoint/daemon"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

type outputResponse struct {
	Stdout   string            `json:"stdout"`
	Stderr   string            `json:"stderr"`
	ExitCode int               `json:"exit_code"`
	Fs       map[string]string `json:"fs"`
}

func getFs() map[string]string {
	fs := make(map[string]string)
	err := filepath.Walk("/home", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("prevent panic by handling failure accessing a path %q: %v\n", path, err)
			return err
		}
		fmt.Printf("visited file or dir: %q\n", path)
		if info.Mode().IsRegular() {
			file, err := os.Open(path)
			if err != nil {
				fmt.Printf("error opening file: %v\n", err)
				return err
			}
			defer file.Close()
			content, err := io.ReadAll(file)
			if err != nil {
				fmt.Printf("error reading file: %v\n", err)
				return err
			}
			pathWithoutPrefix := path[6:]
			fs[pathWithoutPrefix] = string(content)
		}
		return nil
	})
	if err != nil {
		fmt.Printf("error walking the path")
	}
	return fs
}

func Main() {

	go daemon.Run()

	time.Sleep(2 * time.Second)

	cmd := exec.Command("sh", "/input.sh")
	cmd.Dir = "/home"

	var stdoutBytes, stderrBytes bytes.Buffer
	cmd.Stdout = &stdoutBytes
	cmd.Stderr = &stderrBytes

	_ = cmd.Run()

	exitCode := cmd.ProcessState.ExitCode()

	stdout := stdoutBytes.String()
	stderr := stderrBytes.String()

	fs := getFs()

	output := outputResponse{
		Stdout:   stdout,
		Stderr:   stderr,
		ExitCode: exitCode,
		Fs:       fs,
	}

	f, err := os.Create("/output.json")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	err = json.NewEncoder(f).Encode(output)
	if err != nil {
		panic(err)
	}
}
