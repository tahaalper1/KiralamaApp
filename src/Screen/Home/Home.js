import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import firebase from 'firebase/compat';
import MapView, { Marker } from 'react-native-maps';

const db = firebase.firestore();

export default function Home({ navigation }) {
  const [region, setRegion] = useState(null);
  const [city, setCity] = useState('');
  const [allAds, setAllAds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [appBarHeight, setAppBarHeight] = useState(80);
  const [mapHeight, setMapHeight] = useState(250);
  const [allImages, setAllImages] = useState({}); // Bu kısmı ekledik

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchAllAds();
    setRefreshing(false);
  };

  const fetchUserData = async () => {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(userId);

      try {
        const doc = await userRef.get();

        if (doc.exists) {
          const userData = doc.data();

          if (userData && userData.latitude && userData.longitude) {
            const latitude = userData.latitude;
            const longitude = userData.longitude;

            setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            });

            if (userData.city) {
              setCity(userData.city);
            }
          } else {
            console.log('Kullanıcının konum bilgileri eksik.');
          }
        } else {
          console.log('Kullanıcı belgesi bulunamadı.');
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri çekilirken hata oluştu:', error);
      }
    }
  };

// ...

const fetchAllAds = async () => {
  try {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userCity = userDoc.data().city;
        

        const snapshot = await firebase.firestore().collectionGroup('products').get();
        const ads = [];
        const images = {};

        for (const doc of snapshot.docs) {
          const data = doc.data();
          const userRef = await doc.ref.parent.parent.get();
          const userCityFromAd = userRef.data().city;

          if (userCity === userCityFromAd) {
            const imagesSnapshot = await doc.ref.collection('images').get();
            const firstImageDoc = imagesSnapshot.docs[0];
            const imageUrl = firstImageDoc ? firstImageDoc.data().url : null;

            const ownerId = userRef.id; // Extract ownerId


            ads.push({
              id: doc.id,
              imageUrl: imageUrl,
              title: data.productTitle,
              descriptions: data.productInfo,
              price: data.dailyPrice,
              createdAt: data.createdAt,
              userName: data.userIsim, // İsim bilgisini ilana ekle
              userSoyisim: data.userSoyisim, // Soyisim bilgisini ilana ekle
              userAvatarUrl: data.userAvatarUrl, // AvatarURL bilgisini ilana ekle
              ownerId: ownerId,
            });
            console.log('Advertisement ownerId:', ownerId); 
            images[doc.id] = imagesSnapshot.docs.map(doc => doc.data().url);
          }
        }

        setAllImages(images);
        setAllAds(ads);
      }
    }
  } catch (error) {
    console.error('Ürünler çekilirken hata oluştu:', error);
  }
};

// ...

  const renderAd = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Everybody', { ad: { ...item, images: allImages[item.id], ownerId: item.ownerId } })}
    >
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode='contain' />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price} TL/gün</Text>
    </TouchableOpacity>
  );

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const newAppBarHeight = Math.max(80 - scrollY, 50);
    const newMapHeight = Math.max(250 - scrollY, 0);

    setAppBarHeight(newAppBarHeight);
    setMapHeight(newMapHeight);
  };

  useEffect(() => {
    fetchUserData();
    fetchAllAds();
  }, []);
  
  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.appBar, height: appBarHeight }}>
        <Text style={styles.appBarText}>KİRALA</Text>
      </Animated.View>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.input} onPress={null}>
          <Text style={styles.inputText}>{city ? city : 'Giriş Alanı'}</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={{ ...styles.mapContainer, maxHeight: mapHeight }}>
        <MapView style={styles.map} region={region}>
          {region && <Marker coordinate={region} title="Kullanıcı Konumu" />}
        </MapView>
      </Animated.View>
      <View style={styles.cardContainer}>
        <FlatList
          data={allAds}
          keyExtractor={(item) => item.id}
          renderItem={renderAd}
          numColumns={2}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  appBar: {
    backgroundColor: '#FF5454',
    padding: 10,
    height: '10%',
  },
  appBarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    top: '50%',
  },
  inputContainer: {
    backgroundColor: '#FF5454',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 0,
    borderWidth: 0.2,
    borderColor: '#FF5454',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    padding: 15,
    width: '90%',
    height: '100%',
    backgroundColor: 'white',
  },
  inputText: {
    textAlign: 'left',
  },
  mapContainer: {
    flex: 1,
    maxHeight: 250,
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  image: {
    width: '100%',
    height: 175,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginTop: 8,
  },
});
