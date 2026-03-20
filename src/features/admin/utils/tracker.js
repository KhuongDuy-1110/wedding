import axios from "axios";

const API_URL = "http://localhost:3001/api";
const api = axios.create({ baseURL: API_URL });

export const trackEvent = (event, scroll_percent = 0) => {
  const params = new URLSearchParams(window.location.search);
  const guest_name =
    params.get("name") || sessionStorage.getItem("guest_name") || null;
  const path = window.location.pathname;

  if (guest_name) {
    sessionStorage.setItem("guest_name", guest_name);
  }

  api
    .post("/logs", { guest_name, path, event, scroll_percent })
    .catch(() => {});
};
