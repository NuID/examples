import React, { useState } from 'react'
import * as R from 'ramda'

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
  ({ errorKey, history, state, setState, setIsAuthenticated }, submitEvent) => {
    submitEvent.preventDefault()
    submitEvent.stopPropagation()
    api
      .post(
        '/register',
        R.props(['firstName', 'lastName', 'username', 'password'], state)
      )
      .then(res => {
        if (res.status === 200) {
          setIsAuthenticated(true)
          history.push('/dashboard')
        } else {
          setState(R.assoc(errorKey, 'Registration failed', state))
        }
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
    username: '',
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
              label='username'
              name='username'
              value={state.username}
              onChange={setStateValue(state, 'username', setState)}
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
