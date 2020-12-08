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
      .post('/login', R.props(['username', 'password'], state))
      .then(res => {
        if (res.status === 200) {
          setIsAuthenticated(true)
          history.push('/dashboard')
        } else {
          setState(R.assoc(errorKey, 'Login failed', state))
        }
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
    username: '',
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
