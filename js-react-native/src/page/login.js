import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { withRouter } from 'react-router-native'
import * as R from 'ramda'
import Zk from '@nuid/zk-react-native'
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

const decodeJwt = jwt => {
  const payloadBase64 = jwt.split('.')[1]
  const json = Buffer.from(payloadBase64, 'base64').toString()
  return JSON.parse(json)
}

const loginWithChallengeAndProof = R.curry((state, challengeRes) => {
  const challenge = decodeJwt(challengeRes.challengeJwt)
  const proof = Zk.proofFromSecretAndChallenge(state.password, challenge)
  return api.post('/login', {
    email: state.email,
    challengeJwt: challengeRes.challengeJwt,
    proof
  })
})

const onSubmit = R.curry(
  ({ errorKey, history, state, setState, setCurrentUser }, submitEvent) => {
    submitEvent.preventDefault()
    submitEvent.stopPropagation()
    api
      .post('/challenge', { email: state.email })
      .then(loginWithChallengeAndProof(state))
      .then(res => {
        setCurrentUser(res.user)
        history.push('/dashboard')
      })
      .catch(err => {
        setState(R.assoc(errorKey, `Login failed: ${err.message}`, state))
      })
  }
)

const setStateValue = R.curry(
  (state, prop, setter, value) => R.pipe(R.assoc(prop, value), setter)(state)
)

const LoginPage = props => {
  const [state, setState] = useState({
    error: '',
    email: '',
    password: ''
  })
  return (
    <View style={styles.root}>
      <View style={styles.paper}>
        <Text style={styles.h3}>Login</Text>
        <Input
          label='email'
          name='email'
          textContentType='emailAddress'
          value={state.email}
          onChangeText={setStateValue(state, 'email', setState)}
        />
        <Input
          label='password'
          name='password'
          textContentType='password'
          value={state.password}
          onChangeText={setStateValue(state, 'password', setState)}
        />
        <View style={styles.actions}>
          <Button
            onPress={onSubmit({ ...props, state, setState, errorKey: 'error' })}
            title='Login'
          />
          {!R.isEmpty(state.error) && (
            <Text style={styles.error}>{state.error}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default withRouter(LoginPage)
