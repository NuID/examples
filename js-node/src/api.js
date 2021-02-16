const bodyParser = require('body-parser')
const cors = require('cors')
const crypto = require('crypto')
const express = require('express')
const fetch = require('node-fetch')
const R = require('ramda')
const Zk = require('@nuid/zk')
const { User } = require('./user')

const authConfig = { apiKey: process.env.NUID_API_KEY }
const host = process.env.NUID_API_HOST
if (!R.isEmpty(host)) {
  authConfig.host = host
}
const nuidApi = require('@nuid/sdk-nodejs').default({ auth: authConfig })

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
        : nuidApi.auth.credentialGet(user.nuid)
    )
    .then(credentialRes => {
      const credential = credentialRes.parsedBody['nuid/credential']
      return nuidApi.auth.challengeGet(credential)
    })
    .then(({ parsedBody }) =>
      res.status(200).json({
        challengeJwt: parsedBody['nuid.credential.challenge/jwt']
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

      const { challengeJwt, proof } = body
      return nuidApi.auth.challengeVerify(challengeJwt, proof).then(verifyRes =>
        res.status(200).json({
          user: sanitizeUser(user.get())
        })
      )
    })
    .catch(handleError(res, 401))
})

const registerNuid = credential =>
    nuidApi.auth
           .credentialCreate(credential)
           .then(res => res.parsedBody['nu/id'])

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
