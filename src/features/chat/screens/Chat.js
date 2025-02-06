import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMessages, handleSendMessage } from '../controller/ChatController';

const ChatScreen = ({ route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { ownerId } = route.params;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
      } catch (error) {
        console.error('Erreur lors de la récupération de userId:', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    getMessages(userId, ownerId, setMessages);
  }, [userId, ownerId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={item.senderId === userId ? styles.youMessage : styles.serverMessage}>
              <Text>{item.content}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messagesList}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Saisir un message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button
          title="Envoyer"
          onPress={() => handleSendMessage(userId, ownerId, message, setMessages, setMessage)}
          disabled={!message.trim()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messagesList: {
    flex: 1,
  },
  youMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#daf8e3',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  serverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
