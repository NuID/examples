import React from 'react'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const component = props => (
  <Paper>
    <Typography variant='h3'>Register</Typography>
    <form>
      <p>
        <TextField label='first name' name='firstName' />
        <TextField label='last name' name='lastName' />
      </p>
      <p><TextField label='username' name='username' /></p>
      <p><TextField label='password' type='password' name='password' /></p>
      <p><Button color='primary' variant='contained'>Login</Button></p>
    </form>
  </Paper>
)

export default component
