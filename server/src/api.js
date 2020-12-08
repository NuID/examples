const express = require('express')
const R = require('ramda')
const bodyParser = require('body-parser')
const cors = require('cors')
const { User } = require('./user')

const hash256 = R.identity
const sanitizeEmail = R.compose(R.toLower, R.trim)

const handleError = R.curry((res, err) => {
  console.error(err)
  res.sendStatus(500)
})

const app = express()
app.use(bodyParser.json())
app.use((err, req, res, next) => handleError(res, err))
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    allowedHeaders: ['Accept', 'Content-Type']
  })
)

app.post('/login', (req, res) => {
  console.log(req.body)
  const where = R.pipe(
    R.pick(['email', 'password']),
    R.evolve({ email: sanitizeEmail, password: hash256 })
  )(req.body)

  if (R.isEmpty(where.email) || R.isEmpty(where.password)) {
    return res.status(401).json({ errors: ['Not Authorized'] })
  }

  User.findOne({ where })
    .then(user =>
      user
        ? res.status(200).json({ user })
        : res.status(401).json({ errors: ['Not Authorized'] })
    )
    .catch(handleError(res))
})

app.post('/register', (req, res) => {
  const props = R.pipe(
    R.pick(['firstName', 'lastName', 'email', 'password']),
    R.evolve({
      firstName: R.trim,
      lastName: R.trim,
      email: sanitizeEmail,
      password: hash256
    })
  )(req.body)

  User.create(props)
    .then(user => (user ? res.status(201).json({ user }) : res.sendStatus(400)))
    .catch(handleError(res))
})

app.listen(process.env.PORT)
