import axios from "axios";

const API_URL = "/api";
const api = axios.create({ baseURL: API_URL });

export const rsvpApi = {
  submitRSVP: async (data) => {
    const res = await api.post("/rsvp", data);
    return res.data;
  },
  checkStatus: async (shortId) => {
    const res = await api.get(`/rsvp/status/${shortId}`);
    return res.data;
  },
};
