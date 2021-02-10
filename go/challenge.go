package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/NuID/sdk-go/api/auth"
)

type ChallengeReq struct {
    Email string `json:"email"`
}

type ChallengeRes struct {
	ChallengeJWT auth.JWT `json:"challengeJwt"`
}

func handleChallenge(res http.ResponseWriter, req *http.Request) {
	defer func() {
        if err := recover(); err != nil {
            fmt.Printf("Caught panic: %v\n", err)
			requestFailed(res, 500, "Request failed")
			return
        }
    }()

	fmt.Println("Handling /challenge")
	res.Header().Set("Content-Type", "application/json")

	var body ChallengeReq
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

	user, err := ctx.FindByEmail(email)
	if err != nil || user == nil {
		requestFailed(res, 401, "Unauthorized")
		return
	}

	_, credentialGetResBody, err := ctx.api.CredentialGet(user.NuID)
	if err != nil || credentialGetResBody == nil {
		requestFailed(res, 401, "Unauthorized")
		return
	}
	_, challengeGetResBody, err := ctx.api.ChallengeGet(credentialGetResBody.Credential)
	if err != nil || challengeGetResBody == nil {
		requestFailed(res, 401, "Unauthorized")
		return
	}

	res.WriteHeader(200)
	result := &ChallengeRes{ChallengeJWT: challengeGetResBody.ChallengeJWT}
	json.NewEncoder(res).Encode(result)
}
