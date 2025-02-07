import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ConversationsList = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`http://192.168.1.131:3000/conversations/user/${userId}`);
        const data = await response.json();
        console.log("Données reçues :", JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error("Erreur de requête :", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchConversations();
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
        // Déterminer avec qui l'utilisateur discute
        const otherUser = conv.user.id === userId ? conv.messages[0]?.receiver : conv.messages[0]?.sender;
        if (!otherUser) return null;

        // Dernier message envoyé
        const lastMessage = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content : "Aucun message";

        return (
          <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { ownerId: otherUser.id })}>
            <View style={styles.conversationItem}>
              <Image source={{ uri: otherUser.picture }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{otherUser.firstName} {otherUser.lastName}</Text>
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
      console.log("User ID récupéré :", storedUserId);
      setUserId(parseInt(storedUserId)); // Convertir en entier
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
