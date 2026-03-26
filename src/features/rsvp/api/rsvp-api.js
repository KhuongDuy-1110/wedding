import axios from "axios";

const API_URL = "/api";
const api = axios.create({ baseURL: API_URL });

export const rsvpApi = {
  submitRSVP: async (data) => {
    const res = await api.post("/rsvp", data);
    return res.data;
  },
};
