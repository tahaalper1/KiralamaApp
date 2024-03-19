// ChatList.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native';
import firebase from 'firebase/compat';

const ChatList = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  

  useEffect(() => {
    loadChatList();
  }, []);

  const loadChatList = async () => {
    try {
      setRefreshing(true);

      const currentUser = firebase.auth().currentUser;
      const userId = currentUser.uid;

      const chatListSnapshot = await firebase
        .firestore()
        .collection('users')
        .get();

      const loadedChatList = chatListSnapshot.docs
        .filter((doc) => doc.id !== userId)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.İsim,
            surname: data.Soyisim,
            avatarURL: data.avatarURL,
          };
        });

      setChatList(loadedChatList);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading chat list:', error);
      setRefreshing(false);
    }
  };

  const goToChat = async (otherParticipantId, otherParticipantName) => {
    try {
      
      const currentUser = firebase.auth().currentUser;
      const userId = currentUser.uid;
     
      // Odanın benzersiz bir kimliğini oluştur
      const roomId = [userId, otherParticipantId].sort().join('-');
  
      // Odayı Firebase Firestore'dan kontrol et
      const roomSnapshot = await firebase
        .firestore()
        .collection('messages')
        .where('roomId', '==', roomId)
        .get();
  
      // Eğer oda yoksa oluştur
      if (roomSnapshot.empty) {
        // Odayı Firestore'a ekle
        await firebase.firestore().collection('messages').add({
          roomId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          participants: [userId, otherParticipantId],
        });
      }


      navigation.navigate('Chats', otherParticipantId, otherParticipantName );
     
    } catch (error) {
      console.error('Error navigating to chat:', error);
    }
  };
  

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => goToChat(item.id, `${item.name} ${item.surname}`)}>
      <Image style={styles.avatar} source={{ uri: item.avatarURL }} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{`${item.name} ${item.surname}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadChatList} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Arka planı beyaz yap

  },
  chatItem: {
    top:20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // Dikeyde ortala
  },
  name: {
    fontSize: 16,
  },
});

export default ChatList;
