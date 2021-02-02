import React, { useState } from 'react'
import * as R from 'ramda'
import {
  BrowserRouter,
  NavLink,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'

import Dashboard from './page/dashboard'
import Login from './page/login'
import Logout from './page/logout'
import Register from './page/register'

export const ROUTES = {
  dashboard: { label: 'Dashboard', component: Dashboard, to: '/' },
  login: { label: 'Login', component: Login, to: '/login' },
  logout: { label: 'Logout', component: Logout, to: '/logout' },
  register: { label: 'Register', component: Register, to: '/register' }
}

export const NAV = {
  authenticated: [ROUTES.dashboard, ROUTES.logout],
  unauthenticated: [ROUTES.register, ROUTES.login]
}

export const ORDERED_PAGES = [
  ROUTES.register,
  ROUTES.login,
  ROUTES.logout,
  ROUTES.dashboard
]

const navItem = ({ label, to }, index) => (
  <ListItem key={`nav-${index}`} button component={NavLink} to={to}>
    <ListItemText primary={label} />
  </ListItem>
)

const routePage = R.curry(
  (routeProps, { component: Component, label, to }, index) => (
    <Route
      key={`route-${label}-${index}`}
      path={to}
      render={props => <Component {...props} {...routeProps} />}
    />
  )
)

const indexedMap = R.addIndex(R.map)

const Router = props => {
  const [currentUser, setCurrentUser] = useState(null)
  const navRoutes = currentUser ? NAV.authenticated : NAV.unauthenticated
  return (
    <BrowserRouter>
      <header>
        <nav>
          <Drawer anchor='left' variant='permanent'>
            <List>{indexedMap(navItem, navRoutes)}</List>
          </Drawer>
        </nav>
      </header>
      <main>
        <Switch>
          {indexedMap(
            routePage({ currentUser, setCurrentUser }),
            ORDERED_PAGES
          )}
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  )
}

export default Router
