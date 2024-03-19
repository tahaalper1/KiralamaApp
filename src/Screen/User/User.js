import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import { Card } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Overlay } from 'react-native-elements';
import firebase from 'firebase/compat';
import 'firebase/firestore';
import 'firebase/storage';

import Button from '../../Components/Button';
import styles from './styles';
import Input from '../../Components/Input';

const User = () => {
  const [userData, setUserData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [updatedValue, setUpdatedValue] = useState('');
  const [avatarURL, setAvatarURL] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

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

  const fetchUserData = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(userId);

      try {
        const doc = await userRef.get();
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          console.log('Kullanıcı belgesi bulunamadı.');
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri çekilirken hata oluştu:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCardClick = (userInfo) => {
    setSelectedUserInfo(userInfo);
    setIsModalVisible(true);
  };

  const handleUpdateValue = async () => {
    if (updatedValue) {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        Alert.alert('Hata', 'Oturum açmış bir kullanıcı bulunamadı.');
        return;
      }

      const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
      try {
        await userRef.update({ [selectedUserInfo]: updatedValue });
        console.log('Veri başarıyla güncellendi.');
        setUserData((prevUserData) => ({
          ...prevUserData,
          [selectedUserInfo]: updatedValue,
        }));
        setIsModalVisible(false);
        setUpdatedValue('');
      } catch (error) {
        console.error('Veri güncellenirken hata oluştu:', error);
        Alert.alert('Hata', 'Veri güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } else {
      Alert.alert('Uyarı', 'Lütfen geçerli bir değer girin.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Galeri izni verilmedi');
    } else {
      setOverlayVisible(true);
    }
  };

  const handleImagePick = async () => {
    setOverlayVisible(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const imageUrl = await uploadImageToFirebase(result.uri);
      if (imageUrl) {
        setAvatarURL(imageUrl);
        saveImageURLToFirestore(imageUrl);
      }
    }
  };

  const uploadImageToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = firebase.storage().ref().child(`avatars/${Date.now()}`);

    try {
      const snapshot = await storageRef.put(blob);
      console.log('Resim Firebase Storage\'a yüklendi:', snapshot.ref.fullPath);
      return snapshot.ref.getDownloadURL();
    } catch (error) {
      console.error('Resim yüklenirken hata oluştu:', error);
      return null;
    }
  };

  const saveImageURLToFirestore = async (newImageUrl) => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userRef = firebase.firestore().collection('users').doc(currentUser.uid);

      try {
        await userRef.update({ avatarURL: newImageUrl });
        console.log('Resim URL Firestore\'a kaydedildi.');
      } catch (error) {
        console.error('Resim URL kaydedilirken hata oluştu:', error);
      }
    } else {
      console.error('Kullanıcı oturum açmamış.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
      <TouchableOpacity onPress={pickImage}>
        {avatarURL && <Image source={{ uri: avatarURL }} style={{ width: 125, height: 125, borderRadius: 50 }} />}
        </TouchableOpacity>
      </View>

      {userData && (
        <View style={styles.card}>
          {Object.keys(userData).map((key) => {
            // avatarURL'i filtrele
            if (key !== 'avatarURL' && key !== 'city' && key !== 'latitude' && key !== 'longitude' && key !== 'neighborhood' && key !== 'street' && key !== 'address') {
              return (
                <TouchableOpacity key={key} onPress={() => handleCardClick(key)}>
                  <Card>
                    <Text>
                      {key}: {userData[key]}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            } else {
              return null; // avatarURL'i gösterme
            }
          })}
        <Overlay isVisible={isModalVisible} overlayStyle={{ width: '95%', alignItems: 'center', justifyContent: 'center',borderRadius: 20, borderWidth:1, borderColor:"grey"  }}>
  <View>
    <Input
      placeholder={selectedUserInfo}
      value={updatedValue}
      onChangeText={(text) => setUpdatedValue(text)}
    />
    <Button
      title="Güncelle"
      onPress={handleUpdateValue}
      backgroundColor="white"
      textColor="#FF5454"
    />
  </View>
</Overlay>

        </View>
      )}

      <Overlay isVisible={overlayVisible}>
        <View>
          <Button
            title="Resim Seç"
            onPress={handleImagePick}
            backgroundColor="white"
            textColor="#FF5454"
          />
        </View>
      </Overlay>
    </View>
  );
};

export default User;

