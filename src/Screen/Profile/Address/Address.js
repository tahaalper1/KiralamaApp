import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import firebase from 'firebase/compat';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';

const db = firebase.firestore();

export default function Address({ navigation }) {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [address, setAddress] = useState('');
  const [savedAddress, setSavedAddress] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  useEffect(() => {
    const getUserAddress = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const uid = user.uid;
        const userRef = db.collection('users').doc(uid);

        // Fetch saved address from Firestore
        const snapshot = await userRef.get();
        const userData = snapshot.data();

        if (userData && userData.city && userData.neighborhood && userData.street && userData.address) {
          setSavedAddress(userData);
        }
      }
    };

    getUserAddress();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Konum izni reddedildi.');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      setUserLocation(locationData.coords);
    };

    getLocation();
  }, []);

  const saveAddressToFirestore = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;
      const userRef = db.collection('users').doc(uid);
      userRef.set(
        {
          city,
          neighborhood,
          street,
          address,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        { merge: true }
      );
      console.log('Adres bilgileri kaydedildi.');
      setSavedAddress({ city, neighborhood, street, address });
    }
  };

  return (
    <View style={styles.container}>
      {savedAddress ? (
        <ScrollView contentContainerStyle={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.text}>Şehir : {savedAddress.city}</Text>
            <Text style={styles.text}>Mahalle : {savedAddress.neighborhood}</Text>
            <Text style={styles.text}>Cadde : {savedAddress.street}</Text>
            <Text style={styles.text}>Adres : {savedAddress.address}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setSavedAddress(null)}>
            <Text style={{ color: 'white' }}>Adres Ekle</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <Input placeholder="Şehir" onChangeText={(text) => setCity(text)} />
          <Input placeholder="Mahalle" onChangeText={(text) => setNeighborhood(text)} />
          <Input placeholder="Sokak veya Cadde" onChangeText={(text) => setStreet(text)} />
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={5}
            placeholder="Açık Adres"
            onChangeText={(text) => setAddress(text)}
            placeholderTextColor="black"
          />

          <Button title="Konum Bilgisi Al" backgroundColor="white" textColor="#FF5454" onPress={saveAddressToFirestore} />
        </>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems:"center",
    top:'10%',
    width:width/1.1,
    height:width/2.5,
  },
  text:{
    fontSize:18,
  },  
  addButton: {
    backgroundColor: '#FF5454',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    width:width/1.1,
    top:'5%',
  },
  input: {
    width: width / 1.1,
    height: 150,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
