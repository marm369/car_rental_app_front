import { Alert } from "react-native";
import { API_BASE_URL } from "../../../config/config";

export const handleCreateAccountRequest = async (formValues) => {
  try {
 
    // Create the payload with necessary properties
    const payload = {
      username: formValues.username,
      password: formValues.password,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      role: formValues.role,
      picture: formValues.profileImage,
    };

    // Set up request options with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    // Make the POST request to the backend
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse the response
    const result = await response.json();

    if (response.ok) {
      // If the response is successful
      Alert.alert("Success", "Account created successfully!");
      return result;
    } else {
      // If there's an error from the backend
      throw new Error(result.message || "Failed to create account");
    }
  } catch (error) {
    // Handle request errors
    console.error("Error creating account:", error);

    if (error.name === "AbortError") {
      Alert.alert(
        "Error",
        "The request timed out. Please check your internet connection and try again."
      );
    } else {
      Alert.alert(
        "Error",
        `An error occurred while creating the account: ${error.message}. Please try again.`
      );
    }

    return null;
  }
};