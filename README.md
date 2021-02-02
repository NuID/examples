# NuID Node Example Application

Provided here is an example of a Node.js+React application that initially uses
password hashing for authentication. Over the course of four tagged commits
we'll show how to convert from password hashing to using NuID for credential
management, all without changing your login+registration UX.

## Install and Run

The `run` make target will watch both the client and server src directories
and reload their start scripts on change. You can find your API Key after
logging into your free [NuID Portal](https://portal.nuid.io/dashboard) account.

``` sh
npm install
NUID_API_KEY="<your key here>" make run
```

## Overview of NuID

- Trustless authentication using Zero-Knowledge proofs.
- Slots seamlessly into existing password-based flows.
- Eliminates password breach risks. Passwords don't leave your client devices
  and aren't stored on your server.
- NuID Auth API provides ZK credential creation and retrieval.

## Demo: Initial app uses hashed password authentication

- Two core flows in authentication: registration and login.
- Email+Password used for registering and authenticating users.
- Email is the unique key for the user account.
- Password is always sent to backend, hashed, and stored.
- [Browse Code](https://github.com/NuID/node-example/tree/v1)

## Demo: Integrate with NuID Auth API

- Add `@nuid/zk` npm package to both client and server applications.
- Get an API Key from the [NuID Developer Portal](https://portal.nuid.io).
- Add API Key and URL to server process environment.
- Create API Post and Get functions to talk to NuID Auth API.
- [Browse Code](https://github.com/NuID/node-example/tree/v2-nuid-config)
- [See Diff](https://github.com/NuID/node-example/compare/v1...v2-nuid-config)

## Demo: Convert registration to use NuID

- Add `nuid` field to user table.
- Client creates a verified credential with the password during registration.
- Client submits to `/register` with the email and a verified credential.
- The password is not sent to the server.
- Server receives verified credential and registers for a new NuID.
- Server stores the NuID along with the other user parameters.
- [Browse Code](https://github.com/NuID/node-example/tree/v3-register-with-credential)
- [See Diff](https://github.com/NuID/node-example/compare/v2-nuid-config...v3-register-with-credential)

## Demo: Convert login to use NuID

- Add server endpoint `/challenge` to get a challenge for the authenticating user from NuID.
- Client login process asks for a `/challenge` for the user with the given email.
- Challenge JWT claims are decoded client-side and used to generate a ZK Proof with the password.
- Client login submits to `/login` with the email, challenge JWT, and proof.
- The password is not sent to the server.
- Server `/login` verifies the challenge JWT and proof with NuID.
- User is now authenticated.
- [Browse Code](https://github.com/NuID/node-example/tree/v4-login-with-nuid)
- [See Diff](https://github.com/NuID/node-example/compare/v3-register-with-credential...v4-login-with-nuid)
