import React, { useEffect } from 'react'

const LogoutPage = ({ history, setIsAuthenticated }) => {
  useEffect(() => {
    setTimeout(() => {
      setIsAuthenticated(false)
      history.push('/login')
    }, 1500)
  })
  return <p>logging out...</p>
}

export default LogoutPage
