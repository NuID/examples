import React, { useEffect } from 'react'
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
  }
}))

const LogoutPage = props => {
  useEffect(() => {
    setTimeout(() => {
      props.setCurrentUser(null)
      props.history.push('/login')
    }, 750)
  })
  return (
    <div className={props.classes.root}>
      <Paper className={props.classes.paper}>
        <Typography variant='h6'>Logging you out...</Typography>
      </Paper>
    </div>
  )
}

export default styled(LogoutPage)
