import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../../config/Config";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    // Correction des backticks pour l'URL dans fetch
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    // Correction de la déclaration de `errorMessage`
    const errorMessage = `Error ${response.status}: ${response.statusText}`;

    // Récupérer la réponse JSON une seule fois
    const result = await response.json();

    if (!response.ok) {
      console.error("Server responded with error:", errorMessage);
      dispatch({
        type: LOGIN_FAILURE,
        payload: result.message || errorMessage,
      });
      return { success: false, message: result.message || errorMessage };
    }

    // Vérification et stockage des données utilisateur
    if (result.user) {
      await AsyncStorage.setItem("username", result.user.username || "");
      await AsyncStorage.setItem("userId", String(result.user.id || ""));
      await AsyncStorage.setItem("role", result.user.role || "");

      dispatch({ type: LOGIN_SUCCESS, payload: result.user });
      return { success: true, user: result.user };
    } else {
      dispatch({
        type: LOGIN_FAILURE,
        payload: "Données utilisateur invalides.",
      });
      return { success: false, message: "Données utilisateur invalides." };
    }
  } catch (error) {
    console.error("Network error occurred:", error);
    dispatch({
      type: LOGIN_FAILURE,
      payload: "Network error. Please try again.",
    });
    return { success: false, message: "Network error. Please try again." };
  }
};
