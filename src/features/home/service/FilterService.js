import axios from "axios";
import { API_BASE_URL } from "../../../config/Config";

export const FilterService = {
  getFilterOptions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cars/filter-options`);
      return response.data;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      throw error;
    }
  },

  getModelsByBrand: async (brand) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/models?brand=${brand}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  },

  applyFilters: async (filters) => {
    try {
      if (filters.year && !isNaN(filters.year)) {
        filters.year = Number(filters.year);
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/cars/apply-filters`,
        filters
      );
      return response.data.cars;
    } catch (error) {
      console.error("FilterService: Error applying filters", error);
      throw error;
    }
  },
  
};
