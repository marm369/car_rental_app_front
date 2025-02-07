import axios from "axios";
import { API_BASE_URL } from "../../../config/Config";

export const ReservationService = {
  createReservation: async (reservationData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reservations/create`,
        reservationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },
  getOwnerReservations: async (ownerId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/reservations/owner/${ownerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching owner reservations:", error);
      throw error;
    }
  },

  getUserReservationStatus: async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/reservations/user/${userId}/status`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user reservation status:", error);
      throw error;
    }
  },

  approveReservation: async (reservationId, status) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/reservations/owner/approve/${reservationId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("Error approving reservation:", error);
      throw error;
    }
  },
};
