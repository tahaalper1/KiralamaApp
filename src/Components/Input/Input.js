import React from 'react'
import { TextInput, StyleSheet, View } from 'react-native'
import styles from './styles'

export default function Input({ placeholder, value, onChangeText, secureTextEntry }) {
  return (
    <View style={styles.container}>
          <TextInput style={styles.textInput}
            placeholder={placeholder}
            value={value}
           placeholderTextColor="black"
           onChangeText={onChangeText}
           secureTextEntry={secureTextEntry}
          />
    </View>
  
  )
}
