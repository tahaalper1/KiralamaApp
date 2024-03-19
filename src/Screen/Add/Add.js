import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat';
import 'firebase/firestore';
import 'firebase/storage';
import { format } from "date-fns";
import tr from "date-fns/locale/tr";

import styles from './styles';
import Input from '../../Components/Input';
import Button from '../../Components/Button';

const Add = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [dailyPrice, setDailyPrice] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [productTitle, setProductTitle] = useState('');
  
  const user = firebase.auth().currentUser;

  const productImagesRef = user
    ? firebase.firestore().collection('users').doc(user.uid).collection('productImages')
    : null;

  useEffect(() => {
    const fetchImages = async () => {
      if (user) {
        const snapshot = await productImagesRef.get();
        const urls = [];

        snapshot.forEach((doc) => {
          urls.push(doc.data().url);
        });

        setImageUrls(urls);
      }
    };

    fetchImages();
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Galeri izni verilmedi');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImageToFirebase(result.uri);
      if (imageUrl) {
        setImageUrls([...imageUrls, imageUrl]);
        setModalVisible(false);
      }
    }
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref().child(`images/${Date.now()}`);
      await ref.put(blob);
      return ref.getDownloadURL();
    } catch (error) {
      console.error('Resim yüklenirken hata oluştu:', error);
      return null;
    }
  };

  const saveProductToFirestore = async () => {
    const user = firebase.auth().currentUser;
  
    if (user) {
      try {
        // Fetch user information from the "users" collection
        const userSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();
        const userData = userSnapshot.data();
  
       
  
        const { İsim, Soyisim, avatarURL } = userData;

        if (!userData || !userData.İsim || !userData.Soyisim || !userData.avatarURL) {
          console.error('User data is incomplete or undefined.');
          return;
        }
  
        // Save product details along with user information
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        const productsRef = userRef.collection('products');
        const newProductRef = await productsRef.add({
          dailyPrice,
          productInfo,
          productTitle,
          userIsim: İsim, // Add user's Isim to the product
          userSoyisim: Soyisim, // Add user's Soyisim to the product
          userAvatarUrl: avatarURL, // Add user's avatar URL to the product
        });
  
        // Şu anki tarih ve saat bilgisini al
        const currentDate = new Date();
  
        // Türkçe tarih ve saat formatına dönüştür (örnek format: 20 Aralık 2023, 14:30)
        const turkishDate = format(currentDate, "dd MMMM yyyy, HH:mm", { locale: tr });
  
        // Oluşturulan ürün belgesine "createdAt" adlı bir alan ekleyip Türkçe tarih/saat değerini kaydet
        await newProductRef.update({ createdAt: turkishDate });
  
        for (const url of imageUrls) {
          await newProductRef.collection('images').add({ url });
        }
  
        setDailyPrice('');
        setProductInfo('');
        setProductTitle('');
        setImageUrls([]);
        
  
        alert('İlan oluşturuldu.');
        navigation.goBack();
      } catch (error) {
        console.error('İlan oluşturulurken hata oluştu:', error);
        alert('İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.imageProduct}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text>Resim Ekle</Text>
        </TouchableOpacity>
        <ScrollView horizontal>
          {imageUrls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} />
          ))}
        </ScrollView>
        
      </View>

      <View style={styles.input}>
        <Input
          placeholder="Günlük Fiyat"
          onChangeText={(text) => setDailyPrice(text)}
          value={dailyPrice}
        />

        <TextInput
          style={styles.input1}
          placeholder="Ürün Bilgileri"
          placeholderTextColor="black"
          onChangeText={(text) => setProductInfo(text)}
          value={productInfo}
          multiline={true}
          numberOfLines={5}
        />

        <Input
          placeholder="Ürün Başlığı"
          onChangeText={(text) => setProductTitle(text)}
          value={productTitle}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="İlan Oluştur"
          onPress={saveProductToFirestore}
          backgroundColor="white"
          textColor="#FF5454"
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18 }}>Resim Seç</Text>
            <TouchableOpacity onPress={pickImage} style={styles.modalButton}>
              <Text style={styles.buttonText}>Galeri Aç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Add;
