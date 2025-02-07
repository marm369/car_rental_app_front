import { API_BASE_URL } from "../../../config/Config";
import axios from "axios";

export const getAllCars = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/getAllCars`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures (1)", error);
    throw error;
  }
};

export const getLatestCars = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/latest`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest cars:", error);
    throw error;
  }
};

export const getCarRentalDetails = async (carId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/${carId}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching car rental details:", error);
    throw error;
  }
};
