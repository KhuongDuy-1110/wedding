import axios from "axios";

// Auto-detect base URL for both local and production environments
const isProduction = import.meta.env.PROD;
const API_URL = isProduction ? "/api" : "http://localhost:3001/api";

export const siteSettingsApi = {
  getSettings: async () => {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  },
  updateSetting: async ({ key_name, value_content }) => {
    const response = await axios.post(`${API_URL}/settings`, {
      key_name,
      value_content,
    });
    return response.data;
  },
};
