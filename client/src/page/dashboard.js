import React from 'react'
import { Redirect } from 'react-router-dom'

const component = props => {
  const authenticated = false // TODO get session data
  return authenticated ? <p>Dashboard</p> : <Redirect to='/login' />
}

export default component
