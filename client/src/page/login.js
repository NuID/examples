import React, { useState } from 'react'
import * as R from 'ramda'
import Zk from '@nuid/zk'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import * as api from '../api'

const styled = withStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  paper: {
    margin: theme.spacing(4),
    padding: theme.spacing(2),
    width: '100%'
  },
  actions: {
    marginTop: theme.spacing(2)
  },
  error: {
    color: 'red'
  }
}))

const decodeJwt = jwt => {
  const payloadBase64 = jwt.split('.')[1]
  const json = Buffer.from(payloadBase64, 'base64').toString()
  return JSON.parse(json)
}

const loginWithChallengeAndProof = R.curry((state, challengeRes) => {
  const challenge = decodeJwt(challengeRes.challengeJwt)
  const proof = Zk.proofFromSecretAndChallenge(state.password, challenge)
  return api.post('/login', {
    email: state.email,
    challengeJwt: challengeRes.challengeJwt,
    proof
  })
})

const onSubmit = R.curry(
  ({ errorKey, history, state, setState, setCurrentUser }, submitEvent) => {
    submitEvent.preventDefault()
    submitEvent.stopPropagation()
    api
      .post('/challenge', { email: state.email })
      .then(loginWithChallengeAndProof(state))
      .then(res => {
        setCurrentUser(res.user)
        history.push('/dashboard')
      })
      .catch(err => {
        setState(R.assoc(errorKey, `Login failed: ${err.message}`, state))
      })
  }
)

const setStateValue = R.curry((state, prop, setState, event) => {
  event.preventDefault()
  setState(R.assoc(prop, event.target.value, state))
})

const LoginPage = props => {
  const [state, setState] = useState({
    error: '',
    email: '',
    password: ''
  })
  return (
    <div className={props.classes.root}>
      <Paper className={props.classes.paper}>
        <Typography variant='h3'>Login</Typography>
        <form
          onSubmit={onSubmit({ ...props, state, setState, errorKey: 'error' })}
        >
          <div>
            <TextField
              label='email'
              name='email'
              value={state.email}
              onChange={setStateValue(state, 'email', setState)}
            />
          </div>
          <div>
            <TextField
              label='password'
              type='password'
              name='password'
              value={state.password}
              onChange={setStateValue(state, 'password', setState)}
            />
          </div>
          <div className={props.classes.actions}>
            <Button color='primary' variant='contained' type='submit'>
              Login
            </Button>
            {!R.isEmpty(state.error) && (
              <p className={props.classes.error}>{state.error}</p>
            )}
          </div>
        </form>
      </Paper>
    </div>
  )
}

export default styled(LoginPage)
