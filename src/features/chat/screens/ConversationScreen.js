import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConversationsList from "./conversationList";

const ConversationScreen = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("User ID récupéré :", storedUserId);
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
});

export default ConversationScreen;
