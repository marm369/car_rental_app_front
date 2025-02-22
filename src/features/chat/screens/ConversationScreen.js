"use client"

import React, { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { fetchUserConversations } from "../service/ConversationService"
import Icon from "react-native-vector-icons/Ionicons"

const ConversationItem = React.memo(({ conversation, userId, onPress }) => {
  const otherUser =
    conversation.user.id === userId ? conversation.messages[0]?.receiver : conversation.messages[0]?.sender
  if (!otherUser) return null

  const lastMessage =
    conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : "Aucun message"
  const lastMessageTime =
    conversation.messages.length > 0
      ? new Date(conversation.messages[conversation.messages.length - 1].timestamp)
      : null

  const formattedTime = lastMessageTime && !isNaN(lastMessageTime.getTime()) ? formatTime(lastMessageTime) : ""
  console.log(lastMessageTime);
  return (
    <TouchableOpacity onPress={onPress} style={styles.conversationItem}>
      <Image source={{ uri: otherUser.picture }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {otherUser.firstName} {otherUser.lastName}
          </Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
      <Icon name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  )
})

const ConversationsList = ({ userId }) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchUserConversations(userId)
      setConversations(data)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      loadConversations()
    }
  }, [userId, loadConversations])

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadConversations()
      }
    }, [userId, loadConversations]),
  )

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(conv) => conv.id.toString()}
      renderItem={({ item: conv }) => (
        <ConversationItem
          conversation={conv}
          userId={userId}
          onPress={() =>
            navigation.navigate("Chat", {
              ownerId: conv.user.id === userId ? conv.messages[0]?.receiver.id : conv.messages[0]?.sender.id,
            })
          }
        />
      )}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<Text style={styles.emptyListText}>Aucune conversation</Text>}
    />
  )
}

const ConversationScreen = () => {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId")
      setUserId(Number.parseInt(storedUserId))
    }
    getUserId()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Chats</Text>
        {userId ? (
          <ConversationsList userId={userId} />
        ) : (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        )}
      </View>
    </SafeAreaView>
  )
}

const formatTime = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ""
  }

  const now = new Date()
  const diff = now - date
  const oneDay = 24 * 60 * 60 * 1000
  const oneWeek = 7 * oneDay

  if (diff < oneDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diff < oneWeek) {
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
    return days[date.getDay()]
  } else {
    return date.toLocaleDateString([], { day: "numeric", month: "numeric" })
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000000",
    padding: 16,
    paddingBottom: 8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  nameTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    color: "#8E8E93",
  },
  message: {
    fontSize: 15,
    color: "#8E8E93",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 20,
  },
})

export default ConversationScreen

