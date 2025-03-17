package create

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"session-manager/utils"
)

type request struct {
	Image         string `json:"image"`
	ContainerName string `json:"container_name"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req request
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	command := fmt.Sprintf("docker run -d --rm --name %s --net easyshell -m 10m --cpus 0.1 --pull=always %s/%s -mode session", req.ContainerName, utils.DockerRegistry, req.Image)

	fmt.Println("Command: ", command)

	cmd := exec.Command("sh", "-c", command)

	err = cmd.Run()
	if err != nil {
		http.Error(w, "Failed"+err.Error(), http.StatusInternalServerError)
		return
	}
}
