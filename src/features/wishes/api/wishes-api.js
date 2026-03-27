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
  updateWish: async ({ id, message, visitor_id, invitation_id }) => {
    const response = await api.put(`/wishes/${id}`, { message, visitor_id, invitation_id });
    return response.data;
  },
  recallWish: async ({ id, visitor_id, invitation_id }) => {
    const response = await api.delete(`/wishes/${id}/recall`, { data: { visitor_id, invitation_id } });
    return response.data;
  },
};
