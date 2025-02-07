export const fetchConversations = async (userId) => {
  try {
    const response = await fetch(`http://192.168.1.131:3000/conversations/user/${userId}`);
    const data = await response.json();
    console.log("Données reçues :", JSON.stringify(data, null, 2));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur de requête :", error);
    return [];
  }
};
