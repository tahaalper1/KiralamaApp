import React from 'react'
import { View,Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,Alert,Dimensions  } from 'react-native'
import { useState } from 'react';
import firebase from 'firebase/compat';

//Components
import styles from './styles';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

const { width, height } = Dimensions.get('window');
function Reset({ navigation }) {

  const [email, setEmail] = useState('');


  //şifre yenileme fonksiyonunpm 
 const handleReset = () => {
  //firebase şifre yenileme e-postası
  if (email) {
    firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        //e-posta gönder ve önceki sayfaya dön
        Alert.alert('Şifre Yenileme', 'Şifre yenileme bağlantısı e-posta adresinize gönderildi.');
        navigation.goBack();
      })
      .catch((error) => {
        //şifre yenileme bağlantısı gönderilmediyse hatayı yaz
        Alert.alert('Şifre Yenileme Hatası', error.message);
      });
  } 
};

  return (
    <View  style={styles.container}>
    <View style={styles.inputContainer}>
    <Text style={styles.text_2}>Şifre Yenileme Bağlantısı Oluştur</Text>
      <Input style={styles.textInput} placeholder="E-posta" 
      value={email}
      onChangeText={(text) => setEmail(text)}
      />
    </View>

 
<Button 
    title="Şifre Yenileme Bağlantısı Gönder"
    onPress={handleReset}
    backgroundColor="#FF5454"
    textColor="white"
    />

  </View>
  )
}

export default Reset