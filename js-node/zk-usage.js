/**
 * To run this file:
 *
 * ```sh
 * $ git clone https://github.com/NuID/examples.git
 * $ cd examples/js-node
 * $ npm install
 * $ node
 * > const example = require('./zk-usage');
 * > example('YOUR-API-KEY-HERE').then(status => console.log(status));
 * ```
 */
const fetch = require('node-fetch');
const Zk = require('@nuid/zk');


// Any protocol-compliant provider
const apiRootUrl = 'https://auth.nuid.io';


/*****************************
 * Creating a new credential *
 *****************************/

/**
 * `postCredential` creates a new credential and ultimately registers the new
 * credential to Ethereum's Rinkeby test network. In the future, developers will
 * have control over how credentials are routed and stored.
 *
 * NOTE: Single-arity `Zk.proofFromSecret` generates a unique credential for
 * every invocation. Therefore, it can be rerun to generate inputs to this
 * function.
 */
function postCredential(apiKey, verifiable) {
  let headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  };

  let body = JSON.stringify({
    'nuid.credential/verified': verifiable
  });

  let opts = {
    method: 'POST',
    headers: headers,
    body: body
  };

  return fetch(`${apiRootUrl}/credential`, opts);
}


/*************************************
 * Retrieving public credential data *
 *************************************/

/**
 * `getCredential` retrieves public credential data by its persistent identifier
 * derived at creation and contained in the response of `postCredential`. The
 * identifier is simply an encoded public key.
 *
 * NOTE: Public credential data can also be retrieved by alternative addresses,
 * such as a ledger transaction id, IPFS hash, torrent address, etc.. The NuID
 * Auth API aims to give these persistence facilities a unified interface to
 * facilitate easy retrieval for developers. Credential data can also be
 * retrieved directly from any persistence abstraction with public read
 * semantics.
 */
function getCredential(apiKey, id) {
  let headers = {
    'X-API-Key': apiKey,
    'Accept': 'application/json'
  };

  let opts = {
    method: 'GET',
    headers: headers
  };

  return fetch(`${apiRootUrl}/credential/${id}`, opts);
}


/**********************************
 * Issuing a time-bound challenge *
 **********************************/

/**
 * `postChallenge` can be used to issue a short-lived challenge against public
 * credential data. The challenge is then used to create a stateless
 * authentication flow for persistent, cross-service identities.
 *
 * NOTE: This endpoint considers any well-formed credential valid input. The
 * credential needn't be registered through the NuID Auth API, e.g. using
 * `postCredential`, and needn't be persisted. This allows the `/challenge`
 * endpoint to serve OTP and ephemeral identity use-cases in addition to
 * traditional login.
 */
function postChallenge(apiKey, credential) {
  let headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  };

  let body = JSON.stringify({
    'nuid/credential': credential
  });

  let opts = {
    method: 'POST',
    headers: headers,
    body: body
  };

  return fetch(`${apiRootUrl}/challenge`, opts);
}


/*********************
 * Verifying a proof *
 *********************/

/**
 * `postVerify` is used to verify a proof derived from a given challenge. The
 * endpoint expects valid proof data, as well as a JWT as received from `POST
 * /challenge`.
 *
 * NOTE: Currently, the NuID Auth API supports a JWT-based flow, but in-built
 * support for OAuth, OIDC, and other standards-based protocols are on the
 * immediate roadmap.
 */
function postVerify(apiKey, proof, jwt) {
  let headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  };

  let body = JSON.stringify({
    'nuid.credential.challenge/jwt': jwt,
    'nuid.credential/proof': proof
  });

  let opts = {
    method: 'POST',
    headers: headers,
    body: body
  };

  return fetch(`${apiRootUrl}/challenge/verify`, opts);
}


/*******************************
 * Example authentication flow *
 *******************************/

/**
 * `example` uses the 4 previous functions to demonstrate how the individual
 * endpoints interact, and how they can be used in tandem to create a secure
 * authentication flow where no private data is sent over the wire nor
 * persisted server side.
 *
 * NOTE: the input `secret` emulates a user-chosen, potentially low-entropy
 * secret such as a password. Any enforcement of strength requirements must
 * happen on the client, as an authenticating server never learns any
 * information about the underlying secret from which a proof is derived.
 *
 * NOTE: The `example` function below acts as both the "client" and the
 * "server". However, these functions work identically in a browser client.
 *
 * I.e., in a typical deployment, proof derivation happens in the browser
 * as a result of a user entering their login information and pressing "Login"
 * as they normally would. The resulting protocol looks similar to any other
 * asymmetric authentication scheme:
 *
 * 1. the authenticating server issues a challenge
 * 2. proof derivation occurs on the client, using the `password` <input> value
 *    as the input secret
 * 3. the client POSTs the derived proof to the authenticating server
 * 4. the authenticating server verifies the proof and proceeds appropriately
 *
 * The NuID Auth API and the `@nuid/zk` package are meant to make this type of
 * extensible, secure, developer friendly authentication flow easy to implement.
 *
 * NOTE: The protocol can also be made `WebAuthn`-compliant using the Web
 * Credentials API in compatible browsers. A future example will demonstrate
 * this interoperability.
 */
async function example(apiKey, secret = 'testSecret123') {
  console.log('Deriving proof from secret and self-issued challenge...');
  let postCredentialVerifiable = Zk.verifiableFromSecret(secret);

  console.log(`POSTing proof and challenge to ${apiRootUrl}/credential to register new credential...`);
  let postCredentialResponse = await postCredential(apiKey, postCredentialVerifiable);
  let postCredentialResponseBody = await postCredentialResponse.json();

  console.log('Extracting persistent credential identifier from response...');
  let id = postCredentialResponseBody['nu/id'];

  console.log(`GETing public credential data using persistent credential identifier...`);
  let getCredentialResponse = await getCredential(apiKey, id);
  let getCredentialResponseBody = await getCredentialResponse.json();

  // NOTE: `getCredentialResponseBody` could be `POST`'ed to `/challenge` directly
  console.log('Extracting credential from response...');
  let postChallengeCredential = getCredentialResponseBody['nuid/credential'];

  console.log(`POSTing public credential data to ${apiRootUrl}/challenge to create a challenge...`);
  let postChallengeResponse = await postChallenge(apiKey, postChallengeCredential);
  let postChallengeResponseBody = await postChallengeResponse.json();

  console.log('Extracting challenge from JWT...');
  let jwt = postChallengeResponseBody['nuid.credential.challenge/jwt'];
  let challenge = decodeJwtPayload(jwt);

  console.log('Deriving proof from secret and server-issued challenge...');
  let postVerifyProof = Zk.proofFromSecretAndChallenge(secret, challenge);

  console.log(`POSTing proof and JWT to ${apiRootUrl}/challenge/verify to verify proof...`);
  let postVerifyResponse = await postVerify(apiKey, postVerifyProof, jwt);
  let postVerifyResponseStatus = await postVerifyResponse.status;

  console.log(`Returning verification status [${postVerifyResponseStatus}]...`);
  return postVerifyResponseStatus;
}


module.exports = example;


/**
 * Naive helper for decoding the payload of a JWT.
 *
 * NOTE: Does not validate JWT properties (algorithm, signature, claims, ...)
 */
function decodeJwtPayload(jwt) {
  let payloadBase64 = jwt.split('.')[1];
  let json = Buffer.from(payloadBase64, 'base64').toString();

  return JSON.parse(json);
}
