import React from 'react'

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

const RegisterPage = ({ classes }) => (
  <div className={classes.root}>
    <Paper className={classes.paper}>
      <Typography variant='h3'>Register</Typography>
      <form>
        <div>
          <TextField label='first name' name='firstName' />
          <TextField label='last name' name='lastName' />
        </div>
        <div><TextField label='username' name='username' /></div>
        <div><TextField label='password' type='password' name='password' /></div>
        <div className={classes.actions}>
          <Button color='primary' variant='contained'>Register</Button>
        </div>
      </form>
    </Paper>
  </div>
)

export default styled(RegisterPage)
