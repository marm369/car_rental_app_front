"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMessages, handleSendMessage } from "../controller/ChatController";
import Icon from "react-native-vector-icons/Ionicons";

const ChatScreen = ({ route }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { ownerId } = route.params;
  const [userId, setUserId] = useState(null);
  const flatListRef = useRef(null);
  const inputHeight = useRef(new Animated.Value(48)).current;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        setUserId(id ? Number.parseInt(id, 10) : null);
      } catch (error) {
        console.error("Erreur lors de la récupération de userId:", error);
      }
    };
    fetchUserId();

    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      getMessages(userId, ownerId, setMessages);
    }
  }, [userId, ownerId]);

  const keyboardWillShow = (event) => {
    Animated.timing(inputHeight, {
      duration: event.duration,
      toValue: 88,
      useNativeDriver: false,
    }).start();
  };

  const keyboardWillHide = (event) => {
    Animated.timing(inputHeight, {
      duration: event.duration,
      toValue: 48,
      useNativeDriver: false,
    }).start();
  };

  const sendMessage = () => {
    handleSendMessage(userId, ownerId, message, setMessages, setMessage);
    flatListRef.current.scrollToEnd({ animated: true });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!userId) return <Text style={styles.loadingText}>Chargement...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => {
          const isSender = item.sender && item.sender.id === userId;

          return (
            <View
              style={[
                styles.messageContainer,
                isSender ? styles.youMessage : styles.serverMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isSender ? styles.youMessageText : styles.serverMessageText,
                ]}
              >
                {item.content}
              </Text>
              <Text style={styles.timeText}>{formatDate(item.timestamp)}</Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <Animated.View style={[styles.inputContainer, { height: inputHeight }]}>
        <TextInput
          style={styles.input}
          placeholder="Saisir un message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Icon
            name="send"
            size={24}
            color={message.trim() ? "#007AFF" : "#C7C7CC"}
          />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
    maxWidth: "80%",
  },
  youMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  serverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E9E9EB",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  youMessageText: {
    color: "#FFFFFF",
  },
  serverMessageText: {
    color: "#000000",
  },
  timeText: {
    fontSize: 11,
    color: "#8E8E93",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#C7C7CC",
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 8,
    padding: 4,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ChatScreen;
