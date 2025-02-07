import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { fetchUserConversations } from "../service/ConversationService";

const ConversationsList = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadConversations = async () => {
      const data = await fetchUserConversations(userId);
      setConversations(data);
      setLoading(false);
    };

    if (userId) {
      loadConversations();
    }
  }, [userId]);

  if (loading) {
    return <Text>Chargement des conversations...</Text>;
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(conv) => conv.id.toString()}
      renderItem={({ item: conv }) => {
        const otherUser =
          conv.user.id === userId
            ? conv.messages[0]?.receiver
            : conv.messages[0]?.sender;
        if (!otherUser) return null;

        const lastMessage =
          conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1].content
            : "Aucun message";

        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Chat", { ownerId: otherUser.id })
            }
          >
            <View style={styles.conversationItem}>
              <Image
                source={{ uri: otherUser.picture }}
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>
                  {otherUser.firstName} {otherUser.lastName}
                </Text>
                <Text style={styles.message}>{lastMessage}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

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
      {userId ? (
        <ConversationsList userId={userId} />
      ) : (
        <Text>Chargement de l'utilisateur...</Text>
      )}
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
