<p align="right"><a href="https://nuid.io"><img src="https://nuid.io/svg/logo.svg" width="20%"></a></p>

# NuID :: [Node.js](https://nodejs.org/) example

This repository contains a heavily distilled and heavily documented demonstration of using the [`@nuid/zk`](https://www.npmjs.com/package/@nuid/zk) package in Node.js to interact with NuID's Auth API. The functions found in [`index.js`](./index.js) are illustrative examples of the documentation found at NuID's [Developer Portal](https://portal.nuid.io).

## Prerequisites

* [`node & npm`](https://nodejs.org/) (tested on v12.16.3 LTS)
* An API Key (freely available at the [portal](https://portal.nuid.io))

## Usage

```bash
$ git clone https://github.com/NuID/node-example.git
$ cd node-example
$ npm install
$ node
...
> const example = require('./index');
> example('YOUR-API-KEY-HERE').then(status => console.log(status));
```

## Documentation

The code has been commented, but more documentation can be found by registering for an API Key and reading the documentation in the [portal](https://portal.nuid.io). We will be publishing prettier and better in every way documentation over the coming months. And always feel welcome to [reach out](mailto:dev@nuid.io) with any questions that arise.

## Contact

[Get in touch](mailto:dev@nuid.io) with any questions or feedback at [dev@nuid.io](dev@nuid.io). We'd love to hear from you.
