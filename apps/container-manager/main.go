package main

import (
	"container-manager/handlers/create"
	"container-manager/handlers/exec"
	is_running "container-manager/handlers/is-running"
	"container-manager/handlers/kill"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/exec", exec.Handler)
	http.HandleFunc("/create", create.Handler)
	http.HandleFunc("/is-running", is_running.Handler)
	http.HandleFunc("/kill", kill.Handler)

	fmt.Println("Listening on port 4000")
	err := http.ListenAndServe(":4000", nil)
	if err != nil {
		panic("Failed to start server")
	}
}
