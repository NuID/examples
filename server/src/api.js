const express = require('express')
const R = require('ramda')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch')
const Zk = require('@nuid/zk')
const { User } = require('./user')

const nuidAuthApi = 'https://auth.nuid.io'
const nuidApiKey = process.env.NUID_API_KEY

const apiGet = path =>
  fetch(`${nuidAuthApi}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-Key': nuidApiKey
    }
  }).then(res =>
    res.ok ? res.json() : Promise.reject({ message: 'Failed to get data', res })
  )

const bodyFromJSON = res =>
  res.text().then(body => (R.isEmpty(body) ? {} : JSON.parse(body)))

const apiPost = (path, body) =>
  fetch(`${nuidAuthApi}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': nuidApiKey
    }
  }).then(res =>
    res.ok
      ? bodyFromJSON(res)
      : Promise.reject({ message: 'Failed to post data', res })
  )

const sha256digest = data =>
  crypto
    .createHash('sha256')
    .update(data, 'utf8')
    .digest('hex')

const sanitizeEmail = R.compose(R.toLower, R.trim)
const sanitizeUser = R.omit(['password'])

const handleError = R.curry((res, status, err) => {
  console.error(err)
  res.sendStatus(status)
})

const app = express()
app.use(bodyParser.json())
app.use((err, req, res, next) => handleError(res, 500, err))
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    allowedHeaders: ['Accept', 'Content-Type']
  })
)

app.post('/challenge', ({ body }, res) => {
  const email = sanitizeEmail(body.email)
  if (R.isEmpty(email)) {
    return res.status(401).json({ errors: ['Unauthorized'] })
  }

  User.findOne({ where: { email } })
    .then(user =>
      !user
        ? Promise.reject({ errors: ['Unauthorized'] })
        : apiGet(`/credential/${user.nuid}`)
    )
    .then(credentialBody => apiPost('/challenge', credentialBody))
    .then(challengeBody =>
      res.status(200).json({
        challengeJwt: challengeBody['nuid.credential.challenge/jwt']
      })
    )
    .catch(handleError(res, 401))
})

app.post('/login', ({ body }, res) => {
  const email = sanitizeEmail(body.email)
  if (R.any(R.isEmpty, [email, body.challengeJwt, body.proof])) {
    return res.status(401).json({ errors: ['Unauthorized 1'] })
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return Promise.reject({ errors: ['Unauthorized 2'] })
      }

      return apiPost('/challenge/verify', {
        'nuid.credential.challenge/jwt': body.challengeJwt,
        'nuid.credential/proof': body.proof
      }).then(verifyRes =>
        res.status(200).json({ user: sanitizeUser(user.get()) })
      )
    })
    .catch(handleError(res, 401))
})

const registerNuid = credential =>
  apiPost('/credential', { 'nuid.credential/verified': credential }).then(
    body => body['nu/id']
  )

const registerUser = body =>
  registerNuid(body.credential).then(nuid =>
    User.create({
      firstName: R.trim(body.firstName),
      lastName: R.trim(body.lastName),
      email: sanitizeEmail(body.email),
      nuid
    })
  )

app.post('/register', ({ body }, res) => {
  const email = sanitizeEmail(body.email)
  if (R.isEmpty(email)) {
    return res.status(400).json({ errors: ['Invalid Request'] })
  }

  User.count({ where: { email } })
    .then(count => {
      return count === 0
        ? registerUser(body)
        : Promise.reject({ message: 'Email address already taken' })
    })
    .then(user => {
      return user
        ? res.status(201).json({ user: sanitizeUser(user.get()) })
        : res.status(400).json({ errors: ['Invalid request'] })
    })
    .catch(handleError(res, 400))
})

app.listen(process.env.PORT)
