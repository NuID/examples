import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import * as R from 'ramda'

const styles = StyleSheet.create({
  container: {
      marginTop: 4,
      marginBottom: 4
  },
  label: {fontWeight: '400'},
  input: {
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      borderStyle: 'solid',
      paddingTop: 4,
      paddingBottom: 4,
      marginTop: 4,
      marginBottom: 4
  }
})

const Input = props => {
  const inputProps = R.omit(['inputStyle', 'label', 'labelStyle', 'style'], props)
  return (
    <View style={R.merge(styles.container, R.propOr({}, 'style', props))} >
      {props.label && (     
        <Text style={R.merge(styles.label, R.propOr({}, 'labelStyle', props))}>
            {props.label}
        </Text>
      )}
      <TextInput
        style={R.merge(styles.input, R.propOr({}, 'inputStyle', props))}
        {...inputProps}
      />
    </View>
  )
}

export default Input
