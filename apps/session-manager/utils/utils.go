package utils

import (
	"net/http"
	"os"
)

var DockerRegistry = os.Getenv("DOCKER_REGISTRY")
var HttpClient *http.Client

func init() {
	HttpClient = &http.Client{}
}
