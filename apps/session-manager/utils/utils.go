package utils

import (
	"net/http"
)

var HttpClient *http.Client

func init() {
	HttpClient = &http.Client{}
}
