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

const onSubmit = R.curry(
  ({ errorKey, history, state, setState, setCurrentUser }, submitEvent) => {
    submitEvent.preventDefault()
    submitEvent.stopPropagation()
    const data = R.pipe(
      R.pick(['firstName', 'lastName', 'email']),
      R.assoc('credential', Zk.verifiableFromSecret(state.password))
    )(state)

    api
      .post('/register', data, 201)
      .then(res => {
        setCurrentUser(res.user)
        history.push('/dashboard')
      })
      .catch(err => {
        setState(
          R.assoc(errorKey, `Registration failed: ${err.message}`, state)
        )
      })
  }
)

const setStateValue = R.curry((state, prop, setter, event) => {
  event.preventDefault()
  setter(R.assoc(prop, event.target.value, state))
})

const RegisterPage = props => {
  const [state, setState] = useState({
    error: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  return (
    <div className={props.classes.root}>
      <Paper className={props.classes.paper}>
        <Typography variant='h3'>Register</Typography>
        <form
          onSubmit={onSubmit({ ...props, state, setState, errorKey: 'error' })}
        >
          <div>
            <TextField
              label='first name'
              name='firstName'
              value={state.firstName}
              onChange={setStateValue(state, 'firstName', setState)}
            />
            <TextField
              label='last name'
              name='lastName'
              value={state.lastName}
              onChange={setStateValue(state, 'lastName', setState)}
            />
          </div>
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
              Register
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

export default styled(RegisterPage)
