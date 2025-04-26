package daemon

import (
	"fmt"
	"os"
	"os/exec"
)

func Run() {
	stat, err := os.Stat("/daemon")
	if err != nil {
		fmt.Println("running without daemon")
		return
	}

	if stat.IsDir() {
		panic("path /daemon exists but is a directory")
	}

	cmd := exec.Command("/daemon")
	err = cmd.Start()
	if err != nil {
		panic("Error starting daemon : " + err.Error())
	}

	_ = cmd.Wait()
	panic("daemon exited")
}
