import axios from "axios";

const API_URL = "/api";
const api = axios.create({ baseURL: API_URL });

export const getVisitorId = () => {
  let visitor_id = localStorage.getItem("visitor_id");
  if (!visitor_id) {
    visitor_id = "v_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("visitor_id", visitor_id);
  }
  return visitor_id;
};

export const trackEvent = (event, scroll_percent = 0) => {
  const visitor_id = getVisitorId();

  const params = new URLSearchParams(window.location.search);
  const guest_name =
    params.get("name") || sessionStorage.getItem("guest_name") || null;
  const path = window.location.pathname;

  if (guest_name) {
    sessionStorage.setItem("guest_name", guest_name);
  }

  api
    .post("/logs", { visitor_id, guest_name, path, event, scroll_percent })
    .catch(() => {});
};

