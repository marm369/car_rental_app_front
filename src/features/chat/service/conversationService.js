import { API_BASE_URL } from "../../../config/config";

export const fetchUserConversations = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/user/${userId}`);
    const data = await response.json();
    console.log("Données reçues :", JSON.stringify(data, null, 2));

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur de requête :", error);
    return [];
  }
};

