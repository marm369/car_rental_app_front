import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ConversationController from "../controller/conversationController";

const ConversationsList = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ConversationController userId={userId} setConversations={setConversations} setLoading={setLoading} />

      {loading ? (
        <Text>Chargement des conversations...</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(conv) => conv.id.toString()}
          renderItem={({ item: conv }) => {
            const otherUser = conv.user.id === userId ? conv.messages[0]?.receiver : conv.messages[0]?.sender;
            if (!otherUser) return null;

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

export default ConversationsList;
