// Favorites.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import firebase from 'firebase/compat';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const uid = user.uid;
        const favoritesRef = firebase.firestore().collection('users').doc(uid).collection('favorites');
        const favoritesSnapshot = await favoritesRef.get();

        const favoritesData = favoritesSnapshot.docs.map((doc) => doc.data());
        setFavorites(favoritesData);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorilerim</Text>
      <FlatList
  data={favorites}
  keyExtractor={(item) => item.adId}
  renderItem={({ item }) => (
    <View style={styles.favoriteCard}>
      {/* Display the image (assuming imageUrls is an array) */}
      {item.imageUrls && item.imageUrls.length > 0 && (
        <Image
          source={{ uri: item.imageUrls[0] }} // Displaying the first image for simplicity
          style={styles.favoriteImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.favoriteTitle}>{item.title}</Text>
      <Text style={styles.favoritePrice}>{`${item.price} TL/gün`}</Text>
      {/* Display other details of the favorite ad */}
    </View>
  )}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  favoriteCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  favoriteImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
    alignItems:"center",
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  favoritePrice: {
    fontSize: 16,
    color: '#FF5454',
    marginBottom: 8,
  },
  // Add styles for other details of the favorite ad
});

export default Favorites;
