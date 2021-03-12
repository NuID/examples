import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import Router from './router'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
})

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Router />
    </SafeAreaView>
  )
}

export default App
