import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native';

const Product = ({ route }) => {
  const [avatarURL, setAvatarURL] = useState('');
  const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
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
            setUserData(userData);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  useEffect(() => {
    const productId = route.params.productId;
    const user = firebase.auth().currentUser;

    if (user && productId) {
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      const productRef = userRef.collection('products').doc(productId);

      productRef
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setProductData(data);

            const imagesSnapshot = await productRef.collection('images').get();
            const imageUrls = imagesSnapshot.docs.map((imageDoc) => imageDoc.data().url);
            setImages(imageUrls);
          } else {
            console.error('Ürün verileri bulunamadı.');
          }
        })
        .catch((error) => {
          console.error('Ürün verileri çekilirken hata oluştu:', error);
        });
    }
  }, [route.params.productId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView>
      <View style={styles.container}>
        {productData && (
          <View style={styles.card}>
            {/* ... (your existing code) */}
            {images.length > 0 && (
              <Swiper style={styles.imageSlider} showsPagination={true}>
                {images.map((imageUrl, index) => (
                  <Image key={index} source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                ))}
              </Swiper>
            )}
            <Text style={styles.title}>{productData.productTitle}</Text>
            <Text style={styles.description}>{productData.productInfo}</Text>
            <Text style={styles.price}>{productData.dailyPrice} TL/gün</Text>
            <Text style={styles.publishDate}>{productData.createdAt}</Text>

          
          </View>
        )}

        <View style={styles.userCard}>
          {avatarURL && <Image source={{ uri: avatarURL }} style={styles.avatar} />}
          {userData && (
            <Text style={styles.userName}>
              {userData.İsim} {userData.Soyisim}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 400,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    top: 20,
    left: '5%',
  },
  description: {
    fontSize: 16,
    margin: 15,
    top: 20,
  },
  price: {
    fontSize: 18,
    left: '4%',
    top: '8%',
    color: '#FF5454',
    alignSelf: 'flex-start',
  },
  publishDate: {
    fontSize: 18,
    alignSelf: 'flex-end',
    right: '5%',
    top: '4%',
    color: '#FF5454',
  },
  card: {
    marginBottom: 20,
  
  },
  userCard: {
    marginTop: '5%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:"white",
    borderTopEndRadius:50,
    borderTopStartRadius:50,
   
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    right: '30%',
    top: '15%',
  },
  userName: {
    fontSize: 18,
    bottom: '35%',
    right:"6%",
  },
  imageSlider: {
    height: 400,
  },
  sendMessageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF5454',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendMessageButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Product;
