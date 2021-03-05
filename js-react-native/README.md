# NuID :: React Native Example

This project was bootstrapped with [Create React Native
App](https://www.npmjs.com/package/create-react-native-app).

The code here is meant to show an example application which has user
registration and login flows on React Native. It will communicate with any
backend listening at `PORT=4001`. See the [Parent README](../README.md) for a
list of supported client and server examples.

The examples provided here are meant to supplement the official documentation
found at NuID's [Developer Portal](https://portal.nuid.io/docs).

## Usage

``` bash
# Fetch the code
$ git clone https://github.com/NuID/examples.git
$ cd examples

# All servers will need an API Key to talk to the API
$ export NUID_API_KEY="<your api key>"

# The start target will fetch all necessary dependencies
$ make start client=js-react-native/ios
```

## Native support for `@nuid/zk`

NuID doesn't currently have a `zk` package with direct native support, so you'll
need to do a few additional steps to add some polyfills for some missing
dependencies.

The following is from
[tradle/react-native-crypto](https://github.com/tradle/react-native-crypto) on
GitHub, copied here in case the instructions change in the future. Note that
this process will add a _lot_ of new dependencies for polyfills. It's likely you
don't need all or even most of these libraries. This is a temporary solution
while we work on a fully native supported `zk` library.

> Because this module depends on some node core modules, and react-native doesn't currently have a [resolve.alias a la webpack](https://productpains.com/post/react-native/packager-support-resolvealias-ala-webpack), you will need to use [rn-nodeify](https://github.com/tradle/rn-nodeify) for your shimming needs.

> A suggested workflow:

> 1. Install

  ```sh
  npm i --save react-native-crypto
  # install peer deps
  npm i --save react-native-randombytes
  react-native link react-native-randombytes # on RN >= 0.60, instead do: cd iOS && pod install
  # install latest rn-nodeify
  npm i --save-dev rn-nodeify
  # install node core shims and recursively hack package.json files
  # in ./node_modules to add/update the "browser"/"react-native" field with relevant mappings
  ./node_modules/.bin/rn-nodeify --hack --install
  ```

> 2. `rn-nodeify` will create a `shim.js` in the project root directory

  ```js
  // index.js
  // make sure you use `import` and not require!  
  import './shim.js'
  import crypto from 'crypto'
  // ...the rest of your code
  ```

### Example

See https://github.com/mvayngrib/rncryptoexample for an example implementation.
