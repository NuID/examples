import React, { useState } from 'react'
import * as R from 'ramda'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

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
  }
}))

const onSubmit = R.curry((state, event) => {
  event.preventDefault()
  event.stopPropagation()
  console.log('SUBMIT')
  console.log(state)
})

const setStateValue = R.curry((state, prop, setter, event) => {
  event.preventDefault()
  setter(R.assoc(prop, event.target.value, state))
})

const LoginPage = ({ classes }) => {
  const [state, setState] = useState({
    username: '',
    password: ''
  })
  console.log(state)
  return (
  <div className={classes.root}>
    <Paper className={classes.paper}>
      <Typography variant='h3'>Login</Typography>
      <form onSubmit={onSubmit(state)}>
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
        <div className={classes.actions}>
          <Button color='primary' variant='contained' type='submit'>Login</Button>
        </div>
      </form>
    </Paper>
  </div>
)}

export default styled(LoginPage)
