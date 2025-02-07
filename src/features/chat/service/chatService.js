import axios from 'axios';

const API_URL = 'http://192.168.1.131:3000';

// Fonction pour récupérer les messages
export const fetchConversation = async (userId, ownerId) => {
  try {
    const response = await axios.get(`${API_URL}/conversations/between/${userId}/${ownerId}`);
    console.log(`User ID: ${userId}, Owner ID: ${ownerId}`);
    return response.data.messages || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
};

// Fonction pour envoyer un message
export const sendMessage = async (senderId, receiverId, content) => {
  try {
    await axios.post(`${API_URL}/messages/send`, {
      senderId,
      receiverId,
      content,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
  }
};
