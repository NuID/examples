const express = require('express')
const R = require('ramda')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const { User } = require('./user')

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
