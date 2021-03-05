# NuID :: React.js Example

This project was bootstrapped with [Create React
App](https://github.com/facebook/create-react-app).

The code here is meant to show an example application which has user
registration and login flows. It will communicate with any backend listening at
`PORT=4001`. See the parent README for a list of supported client and server
examples.

The examples provided here are meant to supplement the official
documentation found at NuID's [Developer Portal](https://portal.nuid.io).

## Usage

``` bash
# Fetch the code
$ git clone https://github.com/NuID/examples.git
$ cd examples

# All servers will need an API Key to talk to the API
$ export NUID_API_KEY="<your api key>"

# the start target will fetch all necessary dependencies
$ make start client=js-react
```
