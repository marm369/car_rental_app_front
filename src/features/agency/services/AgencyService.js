import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../config/Config";
import AgencyModel from "../models/AgencyModel";
import * as Location from "expo-location";

export const AgencyService = {
  




  
  async searchPlace(searchPlace) {
    if (!searchPlace.trim()) {
      throw new Error("Please enter a location to search!");
    }
  
    try {
      const result = await Location.geocodeAsync(searchPlace);
  
      if (result.length > 0) {
        return {
          latitude: result[0].latitude,
          longitude: result[0].longitude,
        };
      } else {
        throw new Error("Location not found.");
      }
    } catch (error) {
      throw new Error(`Error searching location: ${error.message}`);
    }
  },

  async createAgency(agencyData) {
    if (
      !agencyData.agencyName ||
      !agencyData.description ||
      !agencyData.selectedLocation ||
      !agencyData.image
    ) {
      throw new Error("Please fill all the fields and select an image!");
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("Unable to find userId in local storage!");
      }

      const payload = {
        name: agencyData.agencyName,
        description: agencyData.description,
        location: {
          type: "Point",
          coordinates: [
            agencyData.selectedLocation.longitude,
            agencyData.selectedLocation.latitude,
          ],
        },
        imageBase64: agencyData.image,
        userId: Number.parseInt(userId, 10),
      };

      const response = await fetch(`${API_BASE_URL}/agencies/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create agency. Please try again.");
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw new Error(`An error occurred: ${error.message}`);
    }
  },

  async getAgencyInfo() {
    try {
      const username = await AsyncStorage.getItem("username");
      if (!username) {
        throw new Error("Unable to find username in local storage!");
      }
      const response = await fetch(
        `${API_BASE_URL}/agencies/agencyInfo/${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch agency info");
      }

      const data = await response.json();
      return {
        name: data.name,
        imageBase64: data.imageBase64,
      };
    } catch (error) {
      console.error("Error fetching agency info:", error);
      throw error;
    }
  },

  async getAgencies() {
    try {
      const response = await fetch(`${API_BASE_URL}/agencies/getAgencies`);
      if (!response.ok) {
        throw new Error("Failed to fetch agencies");
      }
      const data = await response.json();
      return data.map(
        (agency) =>
          new AgencyModel(
            agency.id,
            agency.name,
            agency.description,
            agency.imageBase64,
            agency.location,
            agency.userId
          )
      );
    } catch (error) {
      console.error("Error fetching agencies:", error);
      throw error;
    }
  },

  async getAgencyById(agencyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/agencies/${agencyId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch agency details");
      }
      const data = await response.json();
      return new AgencyModel(
        data.id,
        data.name,
        data.description,
        data.imageBase64,
        data.location,
        data.user.id
      );
    } catch (error) {
      console.error("Error fetching agency details:", error);
      throw error;
    }
  },
};

export default AgencyService;
