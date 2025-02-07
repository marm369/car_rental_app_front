import axios from 'axios';

import { API_BASE_URL } from "../../../config/Config";

export const fetchConversation = async (userId, ownerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations/between/${userId}/${ownerId}`);
    return response.data.messages || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
};

// Fonction pour envoyer un message
export const sendMessage = async (senderId, receiverId, content) => {
  try {
    await axios.post(`${API_BASE_URL}/messages/send`, {  
      senderId,
      receiverId,
      content,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
  }
};
