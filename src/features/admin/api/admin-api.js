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
  getInvitations: async () => {
    const res = await api.get("/invitations");
    return res.data;
  },
  createInvitation: async (name, side, template_type) => {
    const res = await api.post("/invitations", { name, side, template_type });
    return res.data;
  },
  bulkCreateInvitations: async (guests) => {
    const res = await api.post("/invitations/bulk", { guests });
    return res.data;
  },
  updateInvitation: async (id, name, template_type) => {
    const res = await api.patch(`/invitations/${id}`, { name, template_type });
    return res.data;
  },
  deleteInvitation: async (id) => {
    const res = await api.delete(`/invitations/${id}`);
    return res.data;
  },
  getInvitationByShortId: async (shortId) => {
    const res = await api.get(`/invitations/by-id/${shortId}`);
    return res.data;
  },
  markInvitationSent: async (id, isSent) => {
    const res = await api.patch(`/invitations/${id}/sent`, { is_sent: isSent });
    return res.data;
  },
  bulkDeleteInvitations: async (ids) => {
    const res = await api.post("/invitations/bulk-delete", { ids });
    return res.data;
  },
  getRSVP: async () => {
    const res = await api.get("/admin/rsvp");
    return res.data;
  },
};
