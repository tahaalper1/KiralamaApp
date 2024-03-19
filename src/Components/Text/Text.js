import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import styles from './styles'

export default function Textt({title , textColor, fontWeight}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: textColor, fontWeight: fontWeight }]}>{title}</Text>
    </View>

  )
}
