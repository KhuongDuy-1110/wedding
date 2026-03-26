import { UAParser } from "ua-parser-js";

export const formatDate = (dt) => {
  if (!dt) return "Chưa rõ";
  try {
    let date = new Date(dt);
    date = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    return date.toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  } catch (e) {
    return "Lỗi ngày";
  }
};

export const parseUA = (uaString) => {
  if (!uaString) return "Không rõ";
  try {
    const parser = new UAParser(uaString);
    const res = parser.getResult();
    const os = res.os.name || "";
    const vendor = res.device.vendor || "";
    const model = res.device.model || "";
    const type =
      res.device.type === "mobile"
        ? "Mobile"
        : res.device.type === "tablet"
          ? "Tablet"
          : "PC";

    if (vendor || model) {
      return `${os} (${vendor} ${model})`.trim();
    }
    return `${os} (${type})`;
  } catch (e) {
    return "Thiết bị lạ";
  }
};

export const capitalizeName = (str) => {
  if (!str) return "";
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};
