package submission

import (
	"bytes"
	"encoding/json"
	"entrypoint/daemon"
	"os"
	"os/exec"
	"time"
)

type outputResponse struct {
	Stdout      string `json:"stdout"`
	Stderr      string `json:"stderr"`
	ExitCode    int    `json:"exit_code"`
	FsZipBase64 string `json:"fs_zip_base64"`
}

func fsZipBase64() string {
	out, err := exec.Command("sh", "-c", "cd /home && zip -r - . | base64").Output()
	if err != nil {
		panic(err)
	}
	return string(out)
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

	fs := fsZipBase64()

	output := outputResponse{
		Stdout:      stdout,
		Stderr:      stderr,
		ExitCode:    exitCode,
		FsZipBase64: fs,
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
