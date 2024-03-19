import React from 'react'
import { KeyboardAvoidingView, View, StyleSheet,Alert,Text,Switch, TouchableOpacity, ScrollView  } from 'react-native'
import { useState } from 'react';
import firebase from 'firebase/compat';


//component
import styles from './styles';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import Textt from '../../Components/Text/Text';
import { Overlay } from 'react-native-elements';


const Register = ({navigation}) =>  {
    
     
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [number, setNumber] = useState('');



    const [overlayVisible, setOverlayVisible] = useState(false);

    const toggleSwitch = () => {
      setIsEnabled((previousState) => !previousState);
      if (!isEnabled) {
        setOverlayVisible(true);
      }
    };
    const [isEnabled, setIsEnabled] = useState(false);
 

  

  const handleSignUp = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const userId = user.uid;

      // Firestore'a kullanıcı verilerini kaydetme
      await firebase.firestore().collection('users').doc(userId).set({
        "İsim": name,
        "Soyisim": surname,
        'E-posta': email,
        "Şifre": password,
        'Numara': number,
        
      });

      Alert.alert('Kayıt', 'Doğrulama e-postası gönderildi.');
      await user.sendEmailVerification();
      navigation.goBack();
    } catch (error) {
      console.error('Kayıt hatası:', error);
    }
  };
    

  return (

    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
    <View style={styles.container}>
      <View style={styles.text}>
        <Textt
          title="Aramıza Katıl"
          textColor="black"
          fontWeight="bold"
        />
      </View>
      <Text style={styles.text_2}>Sende Hemen <Text style={styles.kirala}>Kiralamaya Başla!</Text></Text>

      <Input
        placeholder="İsim"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <Input
        placeholder="Soyisim"
        value={surname}
        onChangeText={(text) => setSurname(text)}
      />

      <Input
        placeholder="E-mail adresiniz"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <Input
        placeholder="Numaranız"
        value={number}
        onChangeText={(text) => setNumber(text)}
        keyboardType="numeric"
      />

      <Input
        placeholder="Şifreniz"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <View style={styles.switch}>
        <Switch
          trackColor={{ false: 'grey', true: '#FF5454' }}
          thumbColor={isEnabled ? '#FF5454' : 'grey'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text style={styles.kvkk}>KVKK Metnini okudum, kabul ediyorum.</Text>
      </View>
      <Overlay isVisible={overlayVisible} overlayStyle={{ maxHeight: '50%', maxWidth:"95%", borderRadius: 20, borderWidth:1, borderColor:"grey" }}>
            <ScrollView contentContainerStyle={styles.kvkk_icerik_container}>
            <Text style={styles.kvkk_baslik}>Kişisel Verilerin Korunması Kanunu (KVKK) Bilgilendirmesi</Text>
              <Text style={styles.kvkk_icerik}>
              Sayın Kullanıcımız,

Bizim için gizlilik ve kişisel verilerin korunması çok önemlidir. Bu nedenle, kişisel verilerinizi toplamak, işlemek ve korumak için gerekli önlemleri aldığımızı belirtmek isteriz. Bu KVKK Bilgilendirmesi, kişisel verilerinizin nasıl işlendiği hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.

1. Hangi Veriler İşlenmektedir?

Kiralama işlemleri ve hizmetler sunumu sırasında adınız, soyadınız, iletişim bilgileriniz (e-posta adresi, telefon numarası), kimlik bilgileriniz ve tercihleriniz gibi kişisel verileriniz işlenebilir.

2. Kişisel Verilerin İşlenme Amaçları

Kişisel verileriniz, aşağıdaki amaçlarla işlenebilir:

Kiralama işlemleri ve sözleşme yönetimi
İletişim
Hizmet sunumu ve iyileştirme
İlgili yasal düzenlemelere uyum
3. Kişisel Verilerin Korunması

Kişisel verileriniz, ilgili yasal düzenlemelere uygun olarak saklanacak, korunacak ve gizli tutulacaktır. Kişisel verilerinizi yetkisiz erişime karşı korumak için gerekli güvenlik önlemleri alınmaktadır.

4. Veri Sahibi Hakları

KVKK kapsamında, kişisel verilerinizin işlenmesi ile ilgili çeşitli haklara sahipsiniz. Bu haklar arasında veriye erişim hakkı, veriyi düzeltme hakkı, veriyi silme hakkı ve rıza geri çekme hakkı gibi haklar bulunmaktadır. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.

5. Değişiklikler

Bu KVKK Bilgilendirmesi, değişikliklere tabi olabilir. Yapılan değişiklikler sitemizde ilan edilecektir. Bu nedenle düzenli olarak güncellemeleri kontrol etmenizi öneririz.

Kişisel verilerin korunması ve gizliliği hakkında herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle iletişime geçin.
Saygılarımızla. 

              </Text>
              {/* KVKK metni burada sığmayan metinler otomatik olarak kaydırma çubuğu ile görüntülenir. */}
            </ScrollView>
            <Button
              title="Okudum, Anladım."
              onPress={() => {
                setOverlayVisible(false);
              }}
              backgroundColor="white"
              textColor="#FF5454"
            />
          </Overlay>

      <View style={styles.button}>
        <Button
          title="Kayıt Ol"
          onPress={handleSignUp}
          backgroundColor="#FF5454"
          textColor="white"
        />
      </View>
    </View>
  </KeyboardAvoidingView>
   
  )
}


export default Register;