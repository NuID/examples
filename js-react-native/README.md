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

## Installing into an existing react-native app

`react-native` doesn't have a perfect hardware interop, so you'll need
to do a few additional steps to get the `zk` package with dependant polyfills
installed correctly.

The following is from
[parshap/node-libs-react-native](https://github.com/parshap/node-libs-react-native) on
GitHub.

1. First you'll need to install a few dependencies:
   + Install the `@nuid/zk-react-native` package  instead of `@nuid/zk`. This is a
     react-native specific version of NuID's `zk` package (which has an
     identical JS interface to `@nuid/zk`).
   + You'll also need `react-native-randombytes` as a top-level dependency in
     your app so that react-native will link it correctly.
   + And finally, `node-libs-react-native` for shimming node dependencies in
     react-native which is necessary to support zk credential and proof
     generation.

```sh
$ yarn add @nuid/zk-react-native node-libs-react-native react-native-randombytes
# if RN < 0.60
$ react-native link react-native-randombytes
# else RN >= 0.60, instead do
$ cd iOS && pod install
```

2. Modify `metro.config.js` to add `extraNodeModules` configuration to wire up
   `node-libs-react-native` correctly:

```js
// metro.config.js
module.exports = {
  // ...
  resolver: {
    extraNodeModules: require('node-libs-react-native')
  }
};
```

3. Import `node-libs-react-native/globals` before you import `@nuid/zk-react-native`:

``` js
// index.js
// Add globals here (or anywhere _before_ importing @nuid/zk-react-native)
import 'node-libs-react-native/globals';
import { registerRootComponent } from 'expo';
import App from './src/app';
registerRootComponent(App);
```
