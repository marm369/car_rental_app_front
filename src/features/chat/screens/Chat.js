import axios from 'axios';
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
        setUserId(id ? parseInt(id, 10) : null);
      } catch (error) {
        console.error('Erreur lors de la récupération de userId:', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      getMessages(userId, ownerId, setMessages);
    }
  }, [userId, ownerId]);

  if (!userId) return <Text>Chargement...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => {
            const date = new Date(item.timestamp);
            const formattedDate = isNaN(date.getTime())
              ? ''
              : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isSender = item.sender && item.sender.id === userId;

            return (
              <View style={[styles.messageContainer, isSender ? styles.youMessage : styles.serverMessage]}>
                <Text style={styles.messageText}>{item.content}</Text>
                <Text style={styles.timeText}>{formattedDate}</Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
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
          onPress={() =>
            handleSendMessage(userId, ownerId, message, setMessages, setMessage)
          }
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
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  youMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#28a745', // Vert pour les messages envoyés
  },
  serverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0', // Gris pour les messages reçus
  },
  messageText: {
    color: '#fff', // Texte blanc pour les messages envoyés
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 5,
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
