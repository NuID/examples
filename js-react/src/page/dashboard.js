import React from 'react'
import { Redirect } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
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
  nuid: {
    overflowWrap: 'anywhere'
  }
}))

const DashboardPage = props => {
  if (!props.currentUser) {
    return <Redirect to='/login' />
  }
  return (
    <div className={props.classes.root}>
      <Paper className={props.classes.paper}>
        <Typography variant='h3'>Account</Typography>
        <p>
          <strong>Name:</strong> {props.currentUser.firstName}{' '}
          {props.currentUser.lastName}
        </p>
        <p>
          <strong>Email:</strong> {props.currentUser.email}
        </p>
        <p>
          <strong>NuID:</strong>{' '}
          <code className={props.classes.nuid}>{props.currentUser.nuid}</code>
        </p>
        <p>
          <strong>Account Created:</strong> {props.currentUser.createdAt}
        </p>
      </Paper>
    </div>
  )
}

export default styled(DashboardPage)
