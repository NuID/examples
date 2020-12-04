import React from 'react'
import * as R from 'ramda'
import {
  BrowserRouter as Router,
  NavLink,
  Redirect,
  Route,
  Switch
} from "react-router-dom"
import 'fontsource-roboto'

import Dashboard from './page/dashboard'
import Login from './page/login'
import Logout from './page/logout'
import Register from './page/register'


const ROUTES = {
  authenticated: [
    {label: "Dashboard", render: Dashboard, to: "/"},
    {label: "Logout", render: Logout, to: "/logout"},
  ],
  unauthenticated: [
    {label: "Register", render: Register, to: "/register"},
    {label: "Login", render: Login, to: "/login"},
  ],
}

const navItem = ({label, to}, index) => (
  <li key={`nav-${index}`}><NavLink to={to}>{label}</NavLink></li>
)

const routePage = ({label, render, to}, index) => (
  <Route key={`route-${label}-${index}`} path={to} render={render} />
)

const indexedMap = R.addIndex(R.map)

const app = () => {
  const authenticated = false // TODO get session data
  const navRoutes = authenticated ? ROUTES.authenticated : ROUTES.unauthenticated
  return (
    <Router>
      <header>
        <nav><ul>{indexedMap(navItem, navRoutes)}</ul></nav>
      </header>
      <main>
        <Switch>
          {indexedMap(routePage, R.concat(ROUTES.unauthenticated, ROUTES.authenticated))}
          <Route path="*"><Redirect to="/" /></Route>
        </Switch>
      </main>
    </Router>
  )
}

export default app
