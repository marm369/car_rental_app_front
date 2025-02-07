import AsyncStorage from '@react-native-async-storage/async-storage'; // Assure-toi d'importer AsyncStorage

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    // Effectue la requête vers le backend
    const response = await fetch(`http://192.168.1.131:3000/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      console.error("Server responded with error:", errorMessage);
      const result = await response.json();
      dispatch({ type: LOGIN_FAILURE, payload: result.message || errorMessage });
      return { success: false, message: result.message || errorMessage };
    }

    // Parse la réponse en JSON
    const result = await response.json();

    // Si la connexion est réussie
    if (response.ok) {
      // Stocker les données utilisateur dans AsyncStorage
      await AsyncStorage.setItem("username", result.user.username);  // Correction de "payload.username" vers "result.user.username"
      await AsyncStorage.setItem("userId", String(result.user.id));  // Convertir en chaîne pour AsyncStorage
      await AsyncStorage.setItem("role", result.user.role);

      dispatch({ type: LOGIN_SUCCESS, payload: result.user });
      return { success: true, user: result.user }; // Retourner l'utilisateur
    }

  } catch (error) {
    console.error("Network error occurred:", error);
    dispatch({ type: LOGIN_FAILURE, payload: "Network error. Please try again." });
    return { success: false, message: "Network error. Please try again." };
  }
};
