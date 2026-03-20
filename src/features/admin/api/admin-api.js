import axios from "axios";

const API_URL = "/api";
const api = axios.create({ baseURL: API_URL });

export const adminApi = {
  getLogs: async () => {
    const res = await api.get("/logs");
    return res.data;
  },
  bulkDeleteLogs: async (ids) => {
    const res = await api.post(`/logs/bulk-delete`, { ids });
    return res.data;
  },
  getAllWishes: async () => {
    const res = await api.get("/admin/wishes");
    return res.data;
  },
  deleteWish: async (id) => {
    const res = await api.delete(`/wishes/${id}`);
    return res.data;
  },
  bulkDeleteWishes: async (ids) => {
    const res = await api.post(`/wishes/bulk-delete`, { ids });
    return res.data;
  },
  hideWish: async (id, hidden) => {
    const res = await api.patch(`/wishes/${id}/hide`, { hidden });
    return res.data;
  },
};
