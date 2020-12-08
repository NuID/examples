import React from 'react'
import { Redirect } from 'react-router-dom'

const DashboardPage = ({ isAuthenticated }) => {
  return isAuthenticated ? <p>Dashboard wtf</p> : <Redirect to='/login' />
}

export default DashboardPage
