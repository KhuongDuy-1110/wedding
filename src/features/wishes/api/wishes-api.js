import axios from "axios";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
});

export const wishesApi = {
  getWishes: async () => {
    const response = await api.get("/wishes");
    return response.data;
  },
  createWish: async (data) => {
    const response = await api.post("/wishes", data);
    return response.data;
  },
};
