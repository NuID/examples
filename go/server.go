package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"gorm.io/gorm"

	"github.com/rs/cors"
	"github.com/NuID/sdk-go/api/auth"
)

type ErrorRes struct {
	Errors []string `json:"errors"`
}

type Server struct {
	db *gorm.DB
	api *auth.APIClient
}

func main() {
	fmt.Println("Initializing...")
	srv := &Server{
		api: auth.NewAPIClient(os.Getenv("NUID_API_KEY")),
		db: initDB(), // see user.go
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/register", srv.registerHandler)   // see register.go
	mux.HandleFunc("/challenge", srv.challengeHandler) // see challenge.go
	mux.HandleFunc("/login", srv.loginHandler)         // see login.go

	port := os.Getenv("PORT")
	addr := "127.0.0.1:" + port
	server := &http.Server{
		Addr: addr,
		Handler: cors.Default().Handler(mux),
	}
	fmt.Printf("Listening at %s\n", addr)
	server.ListenAndServe()
}

func sanitizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func requestFailed(res http.ResponseWriter, status int, message string) {
	res.WriteHeader(status)
	json.NewEncoder(res).Encode(&ErrorRes{Errors: []string{message}})
}
