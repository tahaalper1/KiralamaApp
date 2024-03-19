import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import styles from './styles'

export default function Button({onPress, title ,backgroundColor, textColor}) {
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: backgroundColor }]}> 
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
    </View>

  )
}
