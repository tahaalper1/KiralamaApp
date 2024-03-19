import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import firebase from 'firebase/compat';

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, [searchText]);

  const fetchData = async () => {
    try {
      const snapshot = await firebase.firestore().collectionGroup('products').get();
      const allProducts = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const imagesSnapshot = await doc.ref.collection('images').get();
        const firstImageDoc = imagesSnapshot.docs[0];
        const imageUrl = firstImageDoc ? firstImageDoc.data().url : null;

        allProducts.push({
          id: doc.id,
          imageUrl: imageUrl,
          title: data.productTitle,
          dailyPrice: data.dailyPrice,
        });
      }

      const filteredProducts = allProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchText.toLowerCase())
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Ürünler çekilirken hata oluştu:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.card}>
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.dailyPrice} TL/gün</Text>
      </View>
    </TouchableOpacity>
  );

  const handleProductPress = (product) => {
    console.log('Seçilen Ürün:', product);
    // Burada istediğiniz işlemleri gerçekleştirebilirsiniz, örneğin ürün detay sayfasına yönlendirme.
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Ürün başlığına göre ara..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        style={styles.searchInput}
      />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchInput: {
    marginTop:"10%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatListContainer: {
    padding: 8,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
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
