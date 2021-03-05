import React, { useState } from 'react'
import {
  Button,
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import * as R from 'ramda'
import {
  NativeRouter,
  Link,
  Redirect,
  Route,
  Switch,
  withRouter
} from 'react-router-native'

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

const styles = StyleSheet.create({
  header: {},
  nav: {},
  navList: {},
  main: {}
})

const NavItem = withRouter(({ history, item }) => (
  <Button onPress={() => history.push(item.to)} title={item.label} />
))

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
  return (
    <NativeRouter>
      <View style={styles.header}>
        <View style={styles.nav}>
          <View style={styles.navList} anchor='left' variant='permanent'>
            <FlatList
              data={currentUser ? NAV.authenticated : NAV.unauthenticated}
              keyExtractor={({ label }) => `nav-item-${label}`}
              renderItem={NavItem}
            />
          </View>
        </View>
      </View>
      <View style={styles.main}>
        <Switch>
          {indexedMap(
            routePage({ currentUser, setCurrentUser }),
            ORDERED_PAGES
          )}
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </View>
    </NativeRouter>
  )
}

export default Router
