import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Platform, ScrollView, SafeAreaView } from 'react-native';
import firebase from 'firebase/compat';
import 'firebase/firestore';

import styles from './styles';

const MyAds = ({navigation}) => {
  const [myAds, setMyAds] = useState([]);
  const [avatarURL, setAvatarURL] = useState('');
  const [userData, setUserData] = useState(null);
  const user = firebase.auth().currentUser;

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

  useEffect(() => {
    // Firebase oturum açmış bir kullanıcıyı al
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(userId);

      // Firestore'dan kullanıcı verilerini çek
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUserData(userData);
          } else {
            Alert.alert('Hata', 'Kullanıcı verileri bulunamadı.');
          }
        })
        .catch((error) => {
          console.error('Kullanıcı verileri çekilirken hata oluştu:', error);
          Alert.alert('Hata', 'Kullanıcı verileri çekilirken hata oluştu.');
        });
    }
  }, []);

  useEffect(() => {
    const fetchMyAds = async () => {
      if (user) {
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        const productRef = userRef.collection('products');
        const snapshot = await productRef.get();

        const ads = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();

          // Resim URL'lerini Firestore'dan çek (sadece ilk resmi al)
          const imagesSnapshot = await doc.ref.collection('images').get();
          const firstImageDoc = imagesSnapshot.docs[0]; // İlk resim belgesi
          const imageUrl = firstImageDoc ? firstImageDoc.data().url : null;

          ads.push({
            id: doc.id,
            imageUrl: imageUrl, // İlk resim URL'si
            title: data.productTitle, // Ürün Başlığı
            descriptions: data.productInfo,
            price: data.dailyPrice, // Günlük Fiyat
          });
        }

        setMyAds(ads);
      }
    };

    fetchMyAds();
  }, [user]);

  const renderAd = ({ item }) => (
    <TouchableOpacity style={styles.card}   onPress={() => {
      navigation.navigate('Product',{ productId: item.id });
    }}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode='contain' />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price} TL/gün</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex:1}}>
        <ScrollView  style={styles.container}>
      <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
      {Platform.OS === 'android' && <StatusBar backgroundColor="#6200ea" barStyle="light-content" />}

      <View style={styles.appBar}>
      <View style={styles.icon}>
        {avatarURL && <Image source={{ uri: avatarURL }} style={{ width: 75, height: 75, borderRadius: 50 }} />}
        {userData && (
          <Text style={styles.text}>{userData.İsim}  {userData.Soyisim}</Text>
      )}
        
      </View>

      </View>

      <FlatList
        data={myAds}
        keyExtractor={(item) => item.id}
        renderItem={renderAd}
        numColumns={2}
        
      />
    </View>
    </ScrollView>
    
    </SafeAreaView>
  
  );
};

export default MyAds;
