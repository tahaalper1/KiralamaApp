// Chat.js

import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'firebase/compat';
import { View, Image, Text, Modal, SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native';

const Chat = ({ route , navigation }) => {
  const otherParticipantId = route.params.ownerId;
  const [messages, setMessages] = useState([]);
  const [otherParticipantInfo, setOtherParticipantInfo] = useState(null);

  const [modalVisible, setModalVisible] = useState(true); 
  const closeModal = () => {
    navigation.goBack()
    setModalVisible(false);
  };
  

  console.log(otherParticipantId);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        const userId = currentUser.uid;

        const roomId = [userId, otherParticipantId].sort().join('-');

        const messagesSnapshot = await firebase
          .firestore()
          .collection('messages')
          .where('roomId', '==', roomId)
          .orderBy('createdAt', 'desc')
          .get();

        const loadedMessages = messagesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.senderId,
              name: data.senderName,
            },
          };
        });

        setMessages(loadedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    const loadOtherParticipantInfo = async () => {
      try {
        const otherParticipantSnapshot = await firebase
          .firestore()
          .collection('users')
          .doc(otherParticipantId)
          .get();

        const otherParticipantData = otherParticipantSnapshot.data();
        setOtherParticipantInfo(otherParticipantData);
      } catch (error) {
        console.error('Error loading other participant info:', error);
      }
    };

    loadMessages();
    loadOtherParticipantInfo();
  }, [otherParticipantId]);

  const onSend = async (newMessages = []) => {
    try {
      const currentUser = firebase.auth().currentUser;
      const userId = currentUser.uid;
      const roomId = [userId, otherParticipantId].sort().join('-');

      await firebase.firestore().collection('messages').add({
        roomId,
        text: newMessages[0].text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        senderId: userId,
        senderName: 'Sender Name', // Replace with the actual sender's name
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    
    <SafeAreaView>
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <Text onPress={closeModal} style={styles.backButton}>
            Geri
          </Text>
          <View style={styles.separator} />
        </View>

        {/* GiftedChat component */}
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={{ _id: firebase.auth().currentUser.uid }}
          renderAvatar={() => (
            <View>
              {otherParticipantInfo && (
                <View>
                  <Image
                    source={{ uri: otherParticipantInfo.avatarURL }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
              )}
            </View>
          )}
        />
      </View>
    </Modal>
  </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22,
  },
  header: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 18,
    color: 'red',
    marginBottom: "15%",
    
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    flex: 1,
    
  },
});

export default Chat;
