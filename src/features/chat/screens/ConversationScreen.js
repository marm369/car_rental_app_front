import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConversationsList from "./conversationList";

const ConversationScreen = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(parseInt(storedUserId));
    };
    getUserId();
  }, []);

  return (
    <View style={styles.container}>
      {userId ? <ConversationsList userId={userId} /> : <Text>Chargement de l'utilisateur...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
});

export default ConversationScreen;
