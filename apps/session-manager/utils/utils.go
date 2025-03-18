package utils

import (
	"net/http"
	"os"
)

var DockerRegistry string
var HttpClient *http.Client

func init() {
	HttpClient = &http.Client{}

	DockerRegistry = os.Getenv("DOCKER_REGISTRY")
	if len(DockerRegistry) > 0 {
		DockerRegistry += "/"
	}
}
