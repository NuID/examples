import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { withRouter } from 'react-router-native'
import * as R from 'ramda'
import Zk from '@nuid/zk'
import * as api from '../api'
import Input from '../component/input'

const styles = StyleSheet.create({
  h3: {
    fontSize: 25,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  paper: {
    margin: 20,
    padding: 10,
    width: '100%'
  },
  actions: {
    marginTop: 10
  },
  error: {
    color: 'red'
  }
})

const onSubmit = R.curry(
  ({ errorKey, history, state, setState, setCurrentUser }, submitEvent) => {
    submitEvent.preventDefault()
    submitEvent.stopPropagation()
    Promise
      .resolve(state.password)
      .then(Zk.verifiableFromSecret)
      .then(
        verifiedCredential =>
          R.pipe(
            R.pick(['firstName', 'lastName', 'email']),
            R.assoc('credential', verifiedCredential)
          )(state)
      )
      .then(data => api.post('/register', data, 201))
      .then(res => {
        setCurrentUser(res.user)
        history.push('/dashboard')
      })
      .catch(err => {
        setState(
          R.assoc(errorKey, `Registration failed: ${err.message}`, state)
        )
      })
  }
)

const setStateValue = R.curry(
  (state, prop, setter, value) => R.pipe(R.assoc(prop, value), setter)(state)
)

const RegisterPage = props => {
  const [state, setState] = useState({
    error: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  return (
    <View style={styles.root}>
      <View style={styles.paper}>
        <Text style={styles.h3}>Register</Text>
        <Input
          placeholder='First Name'
          name='firstName'
          textContentType='name'
          value={state.firstName}
          onChangeText={setStateValue(state, 'firstName', setState)}
        />
        <Input
          placeholder='Last Name'
          name='lastName'
          textContentType='name'
          value={state.lastName}
          onChangeText={setStateValue(state, 'lastName', setState)}
        />
        <Input
          placeholder='Email'
          name='email'
          textContentType='emailAddress'
          value={state.email}
          onChangeText={setStateValue(state, 'email', setState)}
        />
        <Input
          placeholder='Password'
          name='password'
          textContentType='password'
          value={state.password}
          onChangeText={setStateValue(state, 'password', setState)}
        />
        <View style={styles.actions}>
          <Button
            onPress={onSubmit({ ...props, state, setState, errorKey: 'error' })}
            title='Register'
          />
          {!R.isEmpty(state.error) && (
            <Text style={styles.error}>{state.error}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default withRouter(RegisterPage)
