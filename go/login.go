package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/NuID/sdk-go/api/auth"
)

type LoginReq struct {
	ChallengeJWT auth.JWT `json:"challengeJwt"`
    Email string `json:"email"`
	Proof map[string]interface{} `json:"proof"`
}

type LoginRes struct {
	 User *User `json:"user"`
}

func (srv *Server) loginHandler(res http.ResponseWriter, req *http.Request) {
	defer func() {
        if err := recover(); err != nil {
            fmt.Printf("Caught panic: %v\n", err)
			requestFailed(res, 500, "Request failed")
			return
        }
    }()

	fmt.Println("Handling /login")
	res.Header().Set("Content-Type", "application/json")

	var body LoginReq
	err := json.NewDecoder(req.Body).Decode(&body)
	if err != nil {
		requestFailed(res, 400, "Invalid Request")
		return
	}
	fmt.Printf("body = %v\n", body)

	email := sanitizeEmail(body.Email)
	if len(email) <= 0 {
		requestFailed(res, 401, "Unauthorized")
		return
	}

	user, err := srv.FindByEmail(email)
	if err != nil || user == nil {
		requestFailed(res, 401, "Unauthorized")
		return
	}

	_, err = srv.api.ChallengeVerify(body.ChallengeJWT, body.Proof)
	if err != nil {
		requestFailed(res, 401, "Unauthorized")
		return
	}

	res.WriteHeader(200)
	result := &LoginRes{User: user}
	json.NewEncoder(res).Encode(result)
}
