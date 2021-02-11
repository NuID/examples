# NuID :: Ruby on Rails Example

This example shows a fully working approach to interacting with the NuID Auth
API during your registration and login flows in a Ruby on Rails app. The example
uses the [`nuid-sdk` gem](https://github.com/NuID/sdk-ruby) (read the
[gem docs](https://rubydoc.info/gems/nuid-sdk)).

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
# use client=js-react by default
$ make start server=ruby-rails
```
