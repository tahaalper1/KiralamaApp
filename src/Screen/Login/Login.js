import React from 'react'
import { KeyboardAvoidingView, View, StyleSheet,Alert, TouchableOpacity,Text } from 'react-native'
import { useState } from 'react';
import firebase from "../../Utils/firebase";

//icon
import { FontAwesome5 } from '@expo/vector-icons';

//component
import styles from './styles';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import Textt from '../../Components/Text/Text';



const Login = ({navigation}) =>  {

//firebase giriş yapma işlemi
const handleLogin = () => {
  firebase.auth()
    .signInWithEmailAndPassword(email.trim(), password)
    .then((userCredentials) => {
      const user = userCredentials.user;

      if (user && user.emailVerified) {
          console.log('Giriş başarılı.');
          navigation.replace("Profile");
          
        } else {
          Alert.alert('Giriş', 'E posta onaylanmadı.');
        }
      console.log('Giriş yapıldı:');
      //Giriş başarılı ise geçmesi gereken sayfa
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //giriş başarısız ise başarısızlığın nedeni
      Alert.alert('Giriş', 'Giriş Başarısız.');
      
    });
};


    //Login button
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
      navigation.navigate("Register");
    }

    const handleReset = () => {
      navigation.navigate("Reset");
    }
  

  return (

<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={{ flex: 1 }}>
<View style={styles.container}>
    
    
<View style={styles.text}>
     <Textt
    style={styles.text_1}
    title="Hoşgeldin"
    textColor="black"
    fontWeight="bold"
    />
</View>
 
    <Text style={styles.text_2}>Hadi Sende  <Text style={styles.kirala}>kirala!</Text></Text>
  
<View style={styles.inputContainer}>
  
<Input 
    placeholder="E-mail girin..."
    value={email}
    onChangeText={(text) => setEmail(text)}
    
    />
</View>

<View style={styles.inputContainer}>
<Input
    placeholder="Şifre girin..."
    value={password}
    onChangeText={(text) => setPassword(text)}
    secureTextEntry={true}
    />

</View>

<Button 
    title="Giriş Yap"
    onPress={handleLogin}
    backgroundColor="#FF5454"
    textColor="white"
    />

<View style={styles.button}>
<Button 
    title="Üye Ol"
    onPress={handleRegister}
    backgroundColor="white"
    textColor="#FF5454"
    />
</View>


<TouchableOpacity style={styles.google} onPress={null}>
        <FontAwesome5 name="google" size={24} color="grey" style={styles.icon} />
        <Text style={styles.googleText}>Google ile Giriş Yap</Text>
      </TouchableOpacity>

<TouchableOpacity  style={styles.button2} onPress={handleReset}>
        <Text style={styles.buttonText2}>Şifremi Unuttum</Text>
      </TouchableOpacity>
</View>
</KeyboardAvoidingView>
   
  )
}


export default Login;