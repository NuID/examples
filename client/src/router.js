import React from 'react'
import * as R from 'ramda'
import {
  BrowserRouter as Router,
  NavLink,
  Redirect,
  Route,
  Switch
} from "react-router-dom"

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'

import Dashboard from './page/dashboard'
import Login from './page/login'
import Logout from './page/logout'
import Register from './page/register'

export const ROUTES = {
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
  <ListItem key={`nav-${index}`} button component={NavLink} to={to}>
    <ListItemText primary={label} />
  </ListItem>
)

const routePage = ({label, render, to}, index) => (
  <Route key={`route-${label}-${index}`} path={to} render={render} />
)

const indexedMap = R.addIndex(R.map)

const component = props => {
  const authenticated = false // TODO get session data
  const navRoutes = authenticated ? ROUTES.authenticated : ROUTES.unauthenticated
  return (
    <Router>
      <header>
        <nav>
          <Drawer anchor='left' variant='permanent'>
            <List>{indexedMap(navItem, navRoutes)}</List>
          </Drawer>
        </nav>
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

export default component
