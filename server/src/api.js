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
      ? res.json()
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

app.post('/login', ({ body }, res) => {
  const where = {
    email: sanitizeEmail(body.email),
    password: sha256digest(body.password)
  }

  if (R.isEmpty(where.email) || R.isEmpty(where.password)) {
    return res.status(401).json({ errors: ['Unauthorized'] })
  }

  User.findOne({ where })
    .then(user =>
      user
        ? res.status(200).json({ user: sanitizeUser(user.get()) })
        : res.status(401).json({ errors: ['Unauthorized'] })
    )
    .catch(handleError(res, 401))
})

app.post('/register', ({ body }, res) => {
  User.create({
    firstName: R.trim(body.firstName),
    lastName: R.trim(body.lastName),
    email: sanitizeEmail(body.email),
    password: sha256digest(body.password)
  })
    .then(user =>
      user
        ? res.status(201).json({ user: sanitizeUser(user.get()) })
        : res.status(400).json({ errors: ['Invalid request'] })
    )
    .catch(handleError(res, 400))
})

app.listen(process.env.PORT)
