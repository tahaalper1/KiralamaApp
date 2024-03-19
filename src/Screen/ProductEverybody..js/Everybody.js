import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native';
import firebase from 'firebase/compat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const Everybody = ({ route }) => {
  const { ad } = route.params;
  const [imageUrls, setImageUrls] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // Add isFavorite state
  const ownerId = ad.ownerId;

  const navigation = useNavigation();

  useEffect(() => {
    // İlgili ilanın resim URL'lerini al
    const adImages = ad.images || [];
    setImageUrls(adImages);

  }, [ad]);

  useEffect(() => {
    // Check if the ad is in the user's favorites and update isFavorite state
    const checkIsFavorite = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const uid = user.uid;
        const favoritesRef = firebase.firestore().collection('users').doc(uid).collection('favorites');
        
        const existingFavorite = await favoritesRef.where('adId', '==', ad.id).get();
        
        setIsFavorite(!existingFavorite.empty); // Update isFavorite based on whether the ad is in favorites
      }
    };

    checkIsFavorite();
  }, [ad.id]);

  const addToFavorites = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;
      const favoritesRef = firebase.firestore().collection('users').doc(uid).collection('favorites');
      
      const existingFavorite = await favoritesRef.where('adId', '==', ad.id).get();
      
      if (existingFavorite.empty) {
        await favoritesRef.add({
          adId: ad.id,
          title: ad.title,
          description: ad.descriptions,
          publishDate: ad.createdAt,
          price: ad.price,
          userName: ad.userName,
          userSoyisim: ad.userSoyisim,
          userAvatarUrl: ad.userAvatarUrl,
          imageUrls: ad.images || [],
        });

        console.log('Ad added to favorites!');
      } else {
        existingFavorite.forEach(async (doc) => {
          await favoritesRef.doc(doc.id).delete();
          console.log('Ad removed from favorites!');
        });
      }

      setIsFavorite(!existingFavorite.empty); // Update isFavorite after adding to favorites
    }
  };

  const goToChat = () => {
    navigation.navigate('Chat', { ownerId: ownerId });
  };
 
  
  
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          {imageUrls.length > 0 && (
            <Swiper style={styles.imageSlider} showsPagination={true}>
              {imageUrls.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </Swiper>
          )}

          <Text style={styles.title}>{ad.title}</Text>
          <Text style={styles.description}>{ad.descriptions}</Text>
          <Text style={styles.price}>{ad.price} TL/gün</Text>
          <Text style={styles.publishDate}>{ad.createdAt}</Text>

          <View style={styles.userCard}>
            <View>
              <Text style={styles.userName}>{ad.userName} {ad.userSoyisim}</Text>
              <Image
                source={{ uri: ad.userAvatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
            style={styles.sendMessageButton}
            onPress={goToChat}
          >
            <Text style={styles.sendMessageButtonText}>Mesaj Gönder</Text>
          </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                {
                  borderColor: 'red', // Default border color
                  backgroundColor: 'white', // Default background color
                },
              ]}
             
              onPress={addToFavorites}
            >
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? 'red' : 'red'} />
            </TouchableOpacity>
           
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
  userCard: {
    marginTop: '10%',
    marginLeft:"10%",
    alignItems: "flex-start",
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:"white",
    borderTopEndRadius:50,
    borderTopStartRadius:50,
    paddingBottom:35,
  },
  userName: {
    fontSize: 18,
    top: '35%',
    marginLeft:"35%"
    
  },
  imageSlider: {
    height: 400,
  },
  sendMessageButton: {
    position: 'absolute',
    bottom: '30%',
    right: '30%',
    backgroundColor: '#FF5454',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendMessageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    

  },
  favoriteButton: {
    position: 'absolute',
    bottom: '25%',
    right: '10%',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, // Add a border width
  },
  
});

export default Everybody;
