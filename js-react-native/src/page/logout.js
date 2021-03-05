import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { withRouter } from 'react-router-native'

const styles = StyleSheet.create({
  info: {
    fontSize: 25
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  paper: {
    margin: 20,
    padding: 10,
    width: '100%'
  }
})

const LogoutPage = props => {
  useEffect(() => {
    setTimeout(() => {
      props.setCurrentUser(null)
      props.history.push('/login')
    }, 750)
  })
  return (
    <View style={styles.root}>
      <View style={styles.paper}>
        <Text style={styles.info}>Logging you out...</Text>
      </View>
    </View>
  )
}

export default withRouter(LogoutPage)
