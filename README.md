<p align="right"><a href="https://nuid.io"><img src="https://nuid.io/svg/logo.svg" width="20%"></a></p>

# NuID :: Examples

This repository contains examples of interacting with various NuID
libraries, packages, and APIs across various languages, libraries, and
frameworks. The examples provided here are meant to suplement the official
documentation found at NuID's [Developer Portal](https://portal.nuid.io).

## Prerequisites

If you want to run some of these examples, you'll generally need the following:

* [`node & npm`](https://nodejs.org/) (tested on v12.16.3 LTS)
* An API Key (freely available at the [portal](https://portal.nuid.io))
* [`make`](https://www.gnu.org/software/make/)

## Usage

```bash
# Fetch the code
$ git clone https://github.com/NuID/examples.git
$ cd examples

# All servers will need an API Key to talk to the API
$ export NUID_API_KEY="<your api key>"

# the start target will fetch all necessary dependencies
# use client=js-react and server=js-node defaults
$ make start

# optionally set the client or server examples to use
# see below for supported clients and servers
$ make start server=go
```

As we add new examples for other languages you'll be able to change
`server=<folder>` or `client=<folder>` to whichever example you wish to run.

### Supported examples

#### `client=<lang>`

+ `js-react` (default) - `make start` or `make start client=js-react`

#### `server=<lang>`

+ `go` - `make start server=go`
+ `js-node` (default) - `make start` or `make start server=js-node`
+ `ruby-rails` - `make start server=ruby-rails`

## Documentation

Lots of the code in each example has been commented, but more documentation can
be found on the [portal](https://portal.nuid.io/docs). We're constantly updating
the docs with guides, videos, and language reference.

## Contact

[Get in touch](https://portal.nuid.io/support) with any questions or feedback at
[support@nuid.io](support@nuid.io). We'd love to hear from you.

---

# `js-react` + `js-node` example

Provided here is an example of a Node.js+React application that initially uses
password hashing for authentication. Over the course of four tagged commits
we'll show how to convert from password hashing to using NuID for credential
management, all without changing your login+registration UX.

Note: This repo's directory structure has changed since the tagged commits
linked below, just be aware you'll only see a `client` and `server` directory
instead of `js-react` and `js-node` respectively (along with any other language
examples that will be added later). Checking out the `main` branch at any time
will get you back to the most recent examples available.

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
