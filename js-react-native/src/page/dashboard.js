import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Redirect } from 'react-router-native'

const styles = StyleSheet.create({
  h3: {
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
  },
  bold: {
    fontWeight: '600'
  },
  nuid: {
  }
})

const DashboardPage = props => {
  if (!props.currentUser) {
    return <Redirect to='/login' />
  }
  return (
    <View style={styles.root}>
      <View style={styles.paper}>
        <Text style={styles.h3}>Account</Text>
        <Text>
          <Text style={styles.bold}>Name:</Text> {props.currentUser.firstName}{' '}
          {props.currentUser.lastName}
        </Text>
        <Text>
          <Text style={styles.bold}>Email:</Text> {props.currentUser.email}
        </Text>
        <Text>
          <Text style={styles.bold}>NuID: </Text>
          <Text style={styles.nuid}>{props.currentUser.nuid}</Text>
        </Text>
        <Text>
          <Text style={styles.bold}>Account Created:</Text> {props.currentUser.createdAt}
        </Text>
      </View>
    </View>
  )
}

export default DashboardPage
