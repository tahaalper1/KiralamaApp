import React from 'react'
import { View, Text, Alert,Image } from 'react-native'
import { ListItem, ButtonGroup,Avatar } from 'react-native-elements';
import { useState } from 'react';
import { useEffect } from 'react';

import firebase from 'firebase/compat';

import styles from './styles';
import Button from '../../Components/Button';

import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Linking, AppState } from 'react-native';

export default function Profile({navigation}) {
    const buttons = ['Kullanıcı Bilgilerim', 'Yayınladığım İlanlar', 'Favoriler',"Adreslerim","Geri Bildirim Ver", "Destek", "Paketler"]; // Düğme metinleri
    const [user, setUser] = useState(firebase.auth().currentUser);
    const [selectedIndex, setSelectedIndex] = React.useState(0); // Aktif düğme indeksi
    const [avatarURL, setAvatarURL] = useState('');

    const handleEmail = () => {
      const recipientEmail = 'tahaalper1992@gmail.com';
      const subject = 'Konu'; // E-posta konusu
      const body = 'Merhaba, İşte e-posta içeriği.'; // E-posta içeriği
    
      const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    
      Linking.openURL(mailtoUrl)
        .then((result) => {
          if (result) {
            console.log('E-posta uygulaması başarıyla başlatıldı.');
          } else {
            console.error('E-posta uygulaması başlatılamadı.');
          }
        })
        .catch((error) => console.error('Hata:', error));
    };

    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          // Geri gitme işlemini engelle
          return true;
        };
  
        // Geri gitme tuşuna event listener ekle
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => {
          // Component ayrıldığında event listener'ı temizle
          backHandler.remove();
        };
      }, [])
    );

    const handleButtonPress = (index) => {
        setSelectedIndex(index);
    
        // Düğmelere tıklandığında sayfa geçişleri burada yapılır
        switch (index) {
          case 0:
            // Kullanıcı Bilgileri sayfasına geçiş yap
            navigation.navigate('User');
            break;
          case 1:
            // Yayınladığım İlanlar sayfasına geçiş yap
            navigation.navigate('MyAds');
            break;
            case 2:
            // Yayınladığım İlanlar sayfasına geçiş yap
            navigation.navigate('Favorites');
            break;
            case 3:
            // Yayınladığım İlanlar sayfasına geçiş yap
            navigation.navigate('Address');
            break;
          // Diğer düğmeler ve sayfa geçişleri buraya eklenir
          case 4:
          handleEmail();
            break;
            case 5:
              handleEmail();
                break;
        }
      };
    


      const handleLogout = () => {
        Alert.alert(
          'Çıkış Yap',
          'Çıkış yapmak istediğinize emin misiniz?',
          [
            { text: 'Hayır', onPress: () => console.log('Çıkış iptal edildi') },
            { text: 'Evet', onPress: () => performLogout() },
          ],
          { cancelable: false }
        );
      };
      
      const performLogout = () => {
        // Çıkış yapma işlemini gerçekleştir
        firebase.auth().signOut().then(() => {
          Alert.alert('Çıkış', 'Çıkış başarılı');
          navigation.goBack();
        }).catch((error) => {
          Alert.alert('Çıkış', 'Çıkış başarısız. Hata: ' + error.message);
        });
      };
  



    const handleDeleteAccount = async () => {
        try {
          if (!user) {
            Alert.alert('Hata', 'Oturum açmış bir kullanıcı bulunamadı.');
            return;
          }
    
          // Firestore'da kullanıcı verilerini silme
          const db = firebase.firestore();
          const userRef = db.collection('users').doc(user.uid);
          await userRef.delete();
    
          user.delete()
            .then(() => {
              console.log('Hesap başarıyla silindi.');
              // Hesap silindiğinde yapılması gereken işlemleri burada gerçekleştirebilirsiniz.
            })
          Alert.alert('Başarılı', 'Hesabınız başarıyla silindi.');
          navigation.goBack();
        } catch (error) {
          console.error('Hesap silinirken bir hata oluştu:', error);
          Alert.alert('Hata', 'Hesap silinirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      };


      useEffect(() => {
        // Firestore'dan avatar URL'sini çekme işlemi...
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
    
          userRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                const userData = doc.data();
                const userAvatarURL = userData.avatarURL;
                setAvatarURL(userAvatarURL);
              }
            })
            .catch((error) => {
              console.error('Avatar URL çekilirken hata oluştu:', error);
            });
        }
      }, []);
  return (
    <View style={styles.container}>
         <View style={styles.icon}>
         {avatarURL && <Image source={{ uri: avatarURL }} style={{ width: 125, height: 125, borderRadius: 50 }} />}
      </View>
    <ListItem bottomDivider>
      {/* Liste öğesi içindeki ButtonGroup */}
      <ButtonGroup
        buttons={buttons}
        selectedIndex={selectedIndex}
        onPress={(index) => handleButtonPress(index)}
        containerStyle={styles.buttonGroupContainer}
        vertical
        innerBorderStyle={{ width: 0 }}
        selectedButtonStyle={{ backgroundColor: '#cfcfcf' }} // Aktif düğme rengi
        textStyle={{ fontSize: 20 }} // Düğme metin font boyutu
      
      />
      
    </ListItem>

<View style={styles.button}>
    <Button
    title="Çıkış Yap"
    onPress={handleLogout}
    backgroundColor="white"
    textColor="#FF5454"
    />

    <Button
    title="Hesabı Sil"
    onPress={handleDeleteAccount}
    backgroundColor="white"
    textColor="#FF5454"
    />
</View>
    
  </View>
  )
}
