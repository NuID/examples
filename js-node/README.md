# NuID :: Node.js Example

This example shows a fully working approach to interacting with the NuID Auth
API during your registration and login flows. The example uses the [NuID Node.js
SDK](https://github.com/NuID/sdk-nodejs) package (read the [package
docs](http://libdocs.s3-website-us-east-1.amazonaws.com/sdk-nodejs/v0.1.0/)).

The examples provided here are meant to suplement the official
documentation found at NuID's [Developer Portal](https://portal.nuid.io).

## Usage

``` bash
# Fetch the code
$ git clone https://github.com/NuID/examples.git
$ cd examples

# All servers will need an API Key to talk to the API
$ export NUID_API_KEY="<your api key>"

# the start target will fetch all necessary dependencies
$ make start server=js-node
```
