const fetch = require('node-fetch');
const Zk = require('@nuid/zk');


// Any protocol-compliant provider
const apiRootUrl = 'https://auth.nuid.io';


/*****************************
 * Creating a new credential *
 *****************************/

/**
 * `postCredential` creates a new credential and ultimately registers
 * the new credential to Ethereum's Rinkeby test network. In the future,
 * developers will have control over how credentials are routed and stored.
 *
 * NOTE: Registering the same proof twice will result in a `HTTP 409
 * conflict` response.
 *
 * NOTE: Single-arity `Zk.proofFromSecret` generates a unique credential
 * for every invocation. Therefore, it can be rerun to generate inputs to
 * this function that will not result in a `409`.
 */
function postCredential(apiKey, proof) {
  let headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  };

  let body = JSON.stringify(proof);

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
 * `getCredential` retrieves public credential data by its persistent
 * identifier derived at creation and contained in the response of
 * `postCredential`. The identifier is simply an encoded public key.
 *
 * NOTE: Public credential data can also be retrieved by alternative
 * addresses, such as a ledger transaction id, IPFS hash, torrent address,
 * etc.. The NuID Auth API aims to give these persistence facilities a
 * unified interface to facilitate easy retrieval for developers. The data
 * itself can of course be retrieved directly from any persistence
 * abstraction with public read semantics.
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
 * `postChallenge` can be used to issue a short-lived challenge
 * against public credential data. The challenge is then used to create a
 * stateless authentication flow for persistent, cross-service identities.
 *
 * NOTE: This endpoint considers any well-formed credential valid input.
 * The credential needn't be registered through the NuID Auth API, e.g. using
 * `postCredential`, and needn't be persisted. This allows the `/challenge`
 * endpoint to serve OTP and ephemeral identity use-cases in addition to
 * traditional login.
 */
function postChallenge(apiKey, credential) {
  let headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  };

  let body = JSON.stringify(credential);

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
 * endpoint expects valid proof data (`{c, s}`, in this case), as well as a
 * JWT as received from `POST /challenge`.
 *
 * NOTE: Currently, the NuID Auth API supports a JWT-based flow, but in-built
 * support for OAuth, OIDC, and other standards-based protocols are on the
 * immediate roadmap.
 */
function postVerify(apiKey, {c, s}, jwt) {
  let headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  };

  let body = JSON.stringify({c: c, s: s, jwt: jwt});

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
  console.log('Deriving proof from secret...');
  let postCredentialProof = Zk.proofFromSecret(secret);

  console.log(`POSTing proof to ${apiRootUrl}/credential to register new credential...`);
  let postCredentialResponse = await postCredential(apiKey, postCredentialProof);
  let postCredentialResponseBody = await postCredentialResponse.json();

  console.log('Extracting persistent credential identifier from response...');
  let id = postCredentialResponseBody['nu/id'];

  console.log(`GETing public credential data using persistent credential identifier...`);
  let getCredentialResponse = await getCredential(apiKey, id);
  let getCredentialResponseBody = await getCredentialResponse.json();

  console.log(`POSTing public credential data to ${apiRootUrl}/challenge to create a challenge...`);
  let postChallengeResponse = await postChallenge(apiKey, getCredentialResponseBody);
  let postChallengeResponseBody = await postChallengeResponse.json();

  console.log('Extracting challenge from JWT...');
  let jwt = postChallengeResponseBody.jwt;
  let challenge = decodeJwtPayload(jwt);

  console.log('Deriving proof from challenge and secret...');
  let postVerifyProof = Zk.proofFromSecret(challenge, secret);

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
