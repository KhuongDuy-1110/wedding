import React, { useState, useEffect, useRef } from "react";
import { adminApi } from "../api/admin-api";
import {
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  LogOut,
  Users,
  MessageSquare,
  BarChart2,
  Image as ImageIcon,
  Upload,
  CheckSquare,
  Square,
  XCircle,
  Send,
  Plus,
  Copy,
  Edit2,
  ExternalLink,
} from "lucide-react";
import {
  useSiteSettings as useSettings,
  useUpdateSetting,
} from "../../../hooks/use-site-settings";
import axios from "axios";
import { UAParser } from "ua-parser-js";

const ADMIN_PASS = "kaina2k";

const formatDate = (dt) => {
  if (!dt) return "Chưa rõ";
  try {
    // If real time is 17:08 ICT but DB stores it as 03:08Z (14h difference),
    // it means the DB date is shifted back by 7 hours from UTC.
    // We add 7 hours to the raw date first.
    let date = new Date(dt);
    // Add 7 hours in milliseconds (7 * 60 * 60 * 1000)
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

const parseUA = (uaString) => {
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

const Badge = ({ children, color = "blue" }) => {
  const map = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-600",
    pink: "bg-pink-100 text-pink-700",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[color]}`}
    >
      {children}
    </span>
  );
};

const AdminPage = () => {
  const [authed, setAuthed] = useState(() => {
    return localStorage.getItem("admin_authed") === "true";
  });
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [tab, setTab] = useState(() => {
    return localStorage.getItem("admin_active_tab") || "logs";
  });
  const [logs, setLogs] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authed) {
      localStorage.setItem("admin_active_tab", tab);
    }
  }, [tab, authed]);

  // Filters specific state
  const [selectedWishes, setSelectedWishes] = useState([]);
  const [wishFilter, setWishFilter] = useState("");
  const [wishSort, setWishSort] = useState("desc");
  const [wishStatusFilter, setWishStatusFilter] = useState("all");
  const [logPathFilter, setLogPathFilter] = useState("all");
  const [logEventFilter, setLogEventFilter] = useState("all");
  const [selectedLogs, setSelectedLogs] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passInput === ADMIN_PASS) {
      setAuthed(true);
      setPassError(false);
      localStorage.setItem("admin_authed", "true");
    } else {
      setPassError(true);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    localStorage.removeItem("admin_authed");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsData, wishesData] = await Promise.all([
        adminApi.getLogs(),
        adminApi.getAllWishes(),
      ]);
      setLogs(logsData);
      setWishes(wishesData);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  const handleDeleteLog = async (id) => {
    if (!confirm("Xóa lịch sử truy cập này?")) return;
    await adminApi.bulkDeleteLogs([id]);
    setLogs((prev) => prev.filter((l) => l.id !== id));
    setSelectedLogs((prev) => prev.filter((lid) => lid !== id));
  };

  const handleBulkDeleteLogs = async () => {
    if (selectedLogs.length === 0) return;
    if (!confirm(`Xóa ${selectedLogs.length} lịch sử truy cập đã chọn?`))
      return;
    setLoading(true);
    try {
      await adminApi.bulkDeleteLogs(selectedLogs);
      setLogs((prev) => prev.filter((l) => !selectedLogs.includes(l.id)));
      setSelectedLogs([]);
    } catch (_) {}
    setLoading(false);
  };

  const toggleSelectAllLogs = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map((l) => l.id));
    }
  };

  const toggleSelectOneLog = (id) => {
    setSelectedLogs((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id],
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa vĩnh viễn lời chúc này?")) return;
    await adminApi.deleteWish(id);
    setWishes((prev) => prev.filter((w) => w.id !== id));
    setSelectedWishes((prev) => prev.filter((sid) => sid !== id));
  };

  const handleBulkDelete = async () => {
    if (selectedWishes.length === 0) return;
    if (!confirm(`Xóa vĩnh viễn ${selectedWishes.length} lời chúc đã chọn?`))
      return;
    setLoading(true);
    try {
      await adminApi.bulkDeleteWishes(selectedWishes);
      setWishes((prev) => prev.filter((w) => !selectedWishes.includes(w.id)));
      setSelectedWishes([]);
    } catch (_) {}
    setLoading(false);
  };

  const toggleSelectAll = () => {
    if (selectedWishes.length === filteredWishes.length) {
      setSelectedWishes([]);
    } else {
      setSelectedWishes(filteredWishes.map((w) => w.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedWishes((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleToggleHide = async (wish) => {
    const newHidden = !wish.hidden;
    await adminApi.hideWish(wish.id, newHidden);
    setWishes((prev) =>
      prev.map((w) =>
        w.id === wish.id ? { ...w, hidden: newHidden ? 1 : 0 } : w,
      ),
    );
  };

  const logStats = () => {
    // We calculate stats based on the path filter so the Stats tab is also filterable
    const filteredForStats = logs.filter((log) => {
      if (logPathFilter === "groom")
        return log.path?.includes("/r") || log.path?.includes("/groom");
      if (logPathFilter === "bride")
        return log.path?.includes("/d") || log.path?.includes("/bride");
      return true;
    });

    const totalLogs = filteredForStats.length;
    const opened = filteredForStats.filter((l) => l.is_opened).length;
    const scrolled100 = filteredForStats.filter(
      (l) => l.scroll_percent === 100,
    ).length;
    const qrViewed = filteredForStats.filter((l) => l.is_qr_viewed).length;
    const totalVisits = filteredForStats.reduce(
      (acc, l) => acc + (l.visit_count || 1),
      0,
    );

    const pctOpened = totalLogs ? Math.round((opened / totalLogs) * 100) : 0;
    const pctScrolled = totalLogs
      ? Math.round((scrolled100 / totalLogs) * 100)
      : 0;

    return {
      total: totalLogs,
      opened,
      qrViewed,
      pctOpened,
      pctScrolled,
      totalVisits,
    };
  };

  const stats = logStats();

  // Filter logs by path and event
  const filteredLogs = logs.filter((log) => {
    // Filter path
    let matchPath = true;
    if (logPathFilter === "groom")
      matchPath = log.path?.includes("/r") || log.path?.includes("/groom");
    else if (logPathFilter === "bride")
      matchPath = log.path?.includes("/d") || log.path?.includes("/bride");

    // Filter event
    let matchEvent = true;
    if (logEventFilter === "opened") matchEvent = log.is_opened;
    else if (logEventFilter === "qr") matchEvent = log.is_qr_viewed;
    else if (logEventFilter !== "all")
      matchEvent = log.event === logEventFilter;

    return matchPath && matchEvent;
  });

  // Filter and Sort Wishes
  const filteredWishes = wishes
    .filter((w) => {
      const search = wishFilter.toLowerCase();
      const matchKeyword =
        w.name.toLowerCase().includes(search) ||
        w.message.toLowerCase().includes(search);

      // Status filter
      let matchStatus = true;
      if (wishStatusFilter === "visible") matchStatus = !w.hidden;
      else if (wishStatusFilter === "hidden") matchStatus = w.hidden;

      return matchKeyword && matchStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return wishSort === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffeaea] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#fd848e] to-[#f3425f] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary/30">
              <span className="text-white text-2xl">🔐</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Khai & Nga Wedding</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className={`border ${passError ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30`}
              autoFocus
            />
            {passError && (
              <p className="text-red-500 text-xs text-center">
                Mật khẩu không đúng
              </p>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#fd848e] to-[#f3425f] text-white font-bold py-3 rounded-xl shadow hover:opacity-90 transition-opacity"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "logs", label: "Truy cập", icon: <BarChart2 size={15} /> },
    { id: "wishes", label: "Lời chúc", icon: <MessageSquare size={15} /> },
    { id: "invitations", label: "Mời khách", icon: <Send size={15} /> },
    { id: "stats", label: "Thống kê", icon: <Users size={15} /> },
    { id: "images", label: "Quản lý ảnh", icon: <ImageIcon size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-800 text-sm sm:text-base">
              💍 Admin Dashboard
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-400">Khai & Nga · 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Làm mới
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={13} />
              Thoát
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-5">
        <div className="flex gap-1 overflow-x-auto no-scrollbar bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-4 w-full sm:w-fit whitespace-nowrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                tab === t.id
                  ? "bg-gradient-to-r from-[#fd848e] to-[#f3425f] text-white shadow"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span className="hidden sm:inline">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "stats" && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              {
                label: "Số khách (Unique)",
                value: stats.total,
                color: "from-blue-500 to-blue-400",
              },
              {
                label: "Đã mở thiệp",
                value: `${stats.pctOpened}%`,
                color: "from-green-500 to-green-400",
              },
              {
                label: "Xem hết 100%",
                value: `${stats.pctScrolled}%`,
                color: "from-orange-500 to-orange-400",
              },
              {
                label: "Xem QR mừng cưới",
                value: stats.qrViewed,
                color: "from-pink-500 to-pink-400",
              },
              {
                label: "Số lượt xem (Total)",
                value: stats.totalVisits,
                color: "from-purple-500 to-purple-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}
                >
                  {s.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "logs" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-700 text-sm">
                  Lịch sử truy cập
                </h2>
                <Badge color="blue">{filteredLogs.length} logs</Badge>
              </div>

              <div className="flex items-center gap-3">
                {selectedLogs.length > 0 && (
                  <button
                    onClick={handleBulkDeleteLogs}
                    className="flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <Trash2 size={13} />
                    Xóa {selectedLogs.length} mục
                  </button>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">
                      Sự kiện:
                    </span>
                    <select
                      value={logEventFilter}
                      onChange={(e) => setLogEventFilter(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none font-medium text-gray-600"
                    >
                      <option value="all">Sự kiện: Tất cả</option>
                      <option value="opened">Đã mở thiệp</option>
                      <option value="qr">Đã xem QR</option>
                      <option value="page_visit">Truy cập</option>
                      <option value="scroll_depth">Cuộn trang</option>
                      <option value="send_wish">Gửi lời chúc</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">
                      Lọc Path:
                    </span>
                    <select
                      value={logPathFilter}
                      onChange={(e) => setLogPathFilter(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none font-medium text-gray-600"
                    >
                      <option value="all">Tất cả</option>
                      <option value="groom">Nhà trai (/r)</option>
                      <option value="bride">Nhà gái (/d)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile View: Log Cards */}
            <div className="sm:hidden grid grid-cols-1 gap-3 p-3 bg-gray-50/30">
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center text-gray-300 text-[11px] italic">Chưa có dữ liệu</div>
              ) : (
                filteredLogs.map((log) => {
                  const eventMap = {
                    open_invitation: { label: "Mở thiệp", color: "green" },
                    view_qr: { label: "Xem QR", color: "pink" },
                    page_visit: { label: "Truy cập", color: "blue" },
                    send_wish: { label: "Gửi lời chúc", color: "pink" },
                    scroll_depth: { label: "Cuộn", color: "orange" },
                  };
                  const ev = eventMap[log.event] || { label: log.event, color: "gray" };
                  const isSide = log.path?.includes("/r") || log.path?.includes("/groom") ? "groom" : (log.path?.includes("/d") || log.path?.includes("/bride") ? "bride" : "none");
                  
                  return (
                    <div key={log.id} className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedLogs.includes(log.id)}
                            onChange={() => toggleSelectOneLog(log.id)}
                            className="rounded border-gray-300 text-primary w-3 h-3"
                          />
                          <div className="font-bold text-gray-800 text-xs">
                            {log.guest_name || "Ẩn danh"}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteLog(log.id)} className="text-gray-300"><Trash2 size={13} /></button>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${ev.color === 'green' ? 'bg-green-50 text-green-600' : ev.color === 'pink' ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-500'}`}>
                          {ev.label}
                        </span>
                        {log.scroll_percent > 0 && (
                          <span className="text-[9px] text-orange-400 font-mono">{log.scroll_percent}%</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-50/50">
                        <div className="flex items-center gap-1">
                           <span className={`text-[8px] font-bold px-1 rounded-sm ${isSide === 'groom' ? 'bg-blue-50 text-blue-400' : (isSide === 'bride' ? 'bg-pink-50 text-pink-400' : 'bg-gray-50 text-gray-300')}`}>
                             {isSide === "none" ? "CHUNG" : (isSide === "groom" ? "RỂ" : "DÂU")}
                           </span>
                           <span className="text-[8px] text-gray-300 font-mono ml-1">{formatDate(log.updated_at || log.created_at)}</span>
                        </div>
                        <div className="text-[8px] text-gray-200 truncate max-w-[60px]">
                           {parseUA(log.user_agent)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-[11px] text-gray-400 uppercase tracking-wider">
                    <th className="px-3 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={
                          filteredLogs.length > 0 &&
                          selectedLogs.length === filteredLogs.length
                        }
                        onChange={toggleSelectAllLogs}
                        className="rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                    </th>
                    <th className="px-4 py-3 text-left">Khách mời</th>
                    <th className="px-5 py-3 text-left hidden md:table-cell">Tiến độ</th>
                    <th className="px-5 py-3 text-left hidden lg:table-cell">Lượt tập trung</th>
                    <th className="px-5 py-3 text-left hidden sm:table-cell">Path</th>
                    <th className="px-5 py-3 text-left hidden xl:table-cell">Thiết bị</th>
                    <th className="px-4 py-3 text-left">Cập nhật</th>
                    <th className="px-3 py-3 text-left w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLogs.map((log, i) => {
                    const eventMap = {
                      open_invitation: { label: "Mở thiệp", color: "green" },
                      view_qr: { label: "Xem QR", color: "pink" },
                      page_visit: { label: "Truy cập", color: "blue" },
                      send_wish: { label: "Gửi lời chúc", color: "pink" },
                      scroll_depth: { label: "Cuộn trang", color: "orange" },
                    };
                    const ev = eventMap[log.event] || {
                      label: log.event,
                      color: "gray",
                    };
                    const isSide =
                      log.path?.includes("/r") || log.path?.includes("/groom")
                        ? "groom"
                        : log.path?.includes("/d") ||
                            log.path?.includes("/bride")
                          ? "bride"
                          : "none";

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <input
                            type="checkbox"
                            checked={selectedLogs.includes(log.id)}
                            onChange={() => toggleSelectOneLog(log.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-700">
                          {log.guest_name || (
                            <span className="text-gray-300 italic">
                              Ẩn danh
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${log.visit_count > 0 ? "bg-blue-400" : "bg-gray-200"}`}
                                title="Đã truy cập"
                              />
                              <div
                                className={`w-2 h-2 rounded-full ${log.is_opened ? "bg-green-400" : "bg-gray-200"}`}
                                title="Đã mở thiệp"
                              />
                              <div
                                className={`w-2 h-2 rounded-full ${log.is_qr_viewed ? "bg-pink-400" : "bg-gray-200"}`}
                                title="Đã xem QR"
                              />
                              <span className="text-[10px] text-gray-400 ml-1 italic font-medium">
                                ({ev.label})
                              </span>
                            </div>
                            {log.scroll_percent > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-orange-400"
                                    style={{ width: `${log.scroll_percent}%` }}
                                  />
                                </div>
                                <span className="text-[9px] text-gray-400 font-mono">
                                  {log.scroll_percent}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <span className="text-xs font-bold">
                              {log.visit_count || 1}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              lần
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs font-mono hidden sm:table-cell">
                          {isSide === "groom" ? (
                            <Badge color="blue">Chú rể</Badge>
                          ) : isSide === "bride" ? (
                            <Badge color="pink">Cô dâu</Badge>
                          ) : (
                            <span className="text-gray-300">/</span>
                          )}
                        </td>
                        <td
                          className="max-w-[120px] truncate px-5 py-3 text-[10px] leading-tight text-gray-500 hidden xl:table-cell"
                          title={log.user_agent}
                        >
                          <span className="text-blue-400 font-bold mr-1">
                            [D:]
                          </span>
                          {parseUA(log.user_agent)}
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">
                          <span className="text-green-400 font-bold mr-1">
                            [T:]
                          </span>
                          {formatDate(log.updated_at || log.created_at)}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredLogs.length === 0 && (
                <p className="text-center py-12 text-gray-300 text-sm">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
          </div>
        )}

        {tab === "wishes" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-700 text-sm">
                  Danh sách lời chúc
                </h2>
                <Badge color="pink">{filteredWishes.length} lời chúc</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm theo tên, nội dung..."
                    value={wishFilter}
                    onChange={(e) => setWishFilter(e.target.value)}
                    className="pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-[200px]"
                  />
                  <span className="absolute left-2.5 top-2 text-gray-400">
                    🔍
                  </span>
                </div>

                <select
                  value={wishSort}
                  onChange={(e) => setWishSort(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none font-medium text-gray-600"
                >
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>

                <select
                  value={wishStatusFilter}
                  onChange={(e) => setWishStatusFilter(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none font-medium text-gray-600"
                >
                  <option value="all">Tất cả (Trạng thái)</option>
                  <option value="visible">Đang hiển thị</option>
                  <option value="hidden">Đã ẩn</option>
                </select>

                {selectedWishes.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <Trash2 size={13} />
                    Xóa {selectedWishes.length} mục
                  </button>
                )}
              </div>
            </div>
            {/* Mobile View: Wish Cards */}
            <div className="sm:hidden grid grid-cols-1 gap-2 p-2 bg-gray-50/20 text-xs">
              {filteredWishes.length === 0 ? (
                <div className="py-12 text-center text-gray-300 text-[10px] italic leading-tight">
                   {wishFilter ? "Không tìm thấy kết quả nào" : "Chưa có lời chúc nào"}
                </div>
              ) : (
                filteredWishes.map((wish) => (
                  <div key={wish.id} className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-1.5">
                       <div className="flex items-center gap-2">
                         <input
                            type="checkbox"
                            checked={selectedWishes.includes(wish.id)}
                            onChange={() => toggleSelectOne(wish.id)}
                            className="rounded border-gray-300 w-3 h-3"
                          />
                          <div className="font-bold text-gray-800 text-[11px]">
                            {wish.name}
                            {wish.flagged === 1 && <span className="text-red-500 ml-1">⚠️</span>}
                          </div>
                       </div>
                       <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase ${wish.hidden ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-500'}`}>
                          {wish.hidden ? "ẨN" : "HIỆN"}
                       </span>
                    </div>
                    
                    <div className="text-[11px] text-gray-500 bg-gray-50/50 p-2 rounded-lg border border-gray-50 mb-2 leading-relaxed italic line-clamp-2">
                       "{wish.message}"
                    </div>

                    <div className="flex justify-between items-center pt-1.5 mt-1.5 border-t border-gray-50/70">
                       <span className="text-[8px] text-gray-300 font-mono">{formatDate(wish.created_at)}</span>
                       <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleHide(wish)}
                            className="text-gray-300"
                          >
                            {wish.hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>
                          <button
                            onClick={() => handleDelete(wish.id)}
                            className="text-red-200"
                          >
                            <Trash2 size={13} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-[11px] text-gray-400 uppercase tracking-wider">
                    <th className="px-5 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={
                          filteredWishes.length > 0 &&
                          selectedWishes.length === filteredWishes.length
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                    </th>
                    <th className="px-5 py-3 text-left">Người gửi (URL)</th>
                    <th className="px-5 py-3 text-left">Lời chúc</th>
                    <th className="px-5 py-3 text-left">Trạng thái</th>
                    <th className="px-5 py-3 text-left">Thời gian</th>
                    <th className="px-5 py-3 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredWishes.map((wish, i) => (
                    <tr
                      key={wish.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={selectedWishes.includes(wish.id)}
                          onChange={() => toggleSelectOne(wish.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">
                              {wish.name}
                            </span>
                            {wish.flagged === 1 && (
                              <span
                                title="Lời chúc chứa từ ngữ nhạy cảm"
                                className="text-red-500 animate-pulse"
                              >
                                ⚠️
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 italic">
                            Log: {wish.guest_path_name || "Không xác định"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 max-w-[260px]">
                        <p className="line-clamp-2 leading-relaxed">
                          {wish.message}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1">
                          {wish.flagged === 1 && (
                            <Badge color="red">Vi phạm</Badge>
                          )}
                          {wish.hidden ? (
                            <Badge color="gray">Đã ẩn</Badge>
                          ) : (
                            <Badge color="green">Hiển thị</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {formatDate(wish.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleHide(wish)}
                            title={wish.hidden ? "Hiện lại" : "Ẩn"}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            {wish.hidden ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(wish.id)}
                            title="Xóa vĩnh viễn"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredWishes.length === 0 && (
                <p className="text-center py-12 text-gray-300 text-sm">
                  {wishFilter
                    ? "Không tìm thấy kết quả nào"
                    : "Chưa có lời chúc nào"}
                </p>
              )}
            </div>
          </div>
        )}
        {tab === "invitations" && <InvitationManager />}
        {tab === "images" && <ImageManager />}
      </div>
    </div>
  );
};

const InvitationManager = () => {
  const { data: settings, isLoading: isSettingsLoading } = useSettings();
  const updateMutation = useUpdateSetting();

  const [side, setSide] = useState("groom"); // groom or bride
  const [guests, setGuests] = useState([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [newName, setNewName] = useState("");
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [localTemplate, setLocalTemplate] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const textareaRef = useRef(null);

  const activeTemplateKey =
    side === "bride"
      ? "invitation_template_bride"
      : "invitation_template_groom";

  useEffect(() => {
    if (settings) {
      setLocalTemplate(
        settings[activeTemplateKey] ||
          "Trân trọng kính mời [name] tới dự lễ cưới của chúng mình tại [link] !",
      );
    }
  }, [settings, side, activeTemplateKey]);

  useEffect(() => {
    setSelectedIds([]);
  }, [side]);

  const insertPlaceholder = (tag) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = localTemplate;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newValue = before + tag + after;
    setLocalTemplate(newValue);

    // Reset cursor after state update (using timeout to let React render)
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const fetchGuests = async () => {
    setIsLoadingGuests(true);
    try {
      const data = await adminApi.getInvitations();
      setGuests(data);
    } catch (e) {
      console.error(e);
    }
    setIsLoadingGuests(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleSaveTemplate = async () => {
    try {
      await updateMutation.mutateAsync({
        key_name: activeTemplateKey,
        value_content: localTemplate,
      });
      alert("Đã lưu mẫu lời mời!");
    } catch (e) {
      console.error(e);
      alert("Lỗi khi lưu mẫu!");
    }
  };

  const capitalizeName = (str) => {
    if (!str) return "";
    return str
      .split(/(\s+)/)
      .map((part) => {
        if (part.trim().length > 0) {
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }
        return part;
      })
      .join("");
  };

  const handleNameChange = (val) => {
    // We want to capitalize words while typing, but carefully
    // If the last character was a space or newline, we should capitalize the current input
    setNewName(capitalizeName(val));
  };

  const addGuest = async (e) => {
    e.preventDefault();
    if (!newName.trim() || isAddingGuest) return;

    let names = newName
      .split("\n")
      .filter((n) => n.trim())
      .map((n) => n.trim());

    // Lọc trùng với danh sách hiện có trên cùng một side
    const existingNames = guests
      .filter((g) => g.side === side)
      .map((g) => g.name.toLowerCase());
    
    names = names.filter(n => !existingNames.includes(n.toLowerCase()));

    if (names.length === 0) {
      alert("Tên khách mời đã có trong danh sách hoặc dữ liệu không hợp lệ.");
      setNewName("");
      return;
    }

    setIsAddingGuest(true);
    try {
      if (names.length === 1) {
        await adminApi.createInvitation(names[0], side);
      } else {
        await adminApi.bulkCreateInvitations(
          names.map((n) => ({ name: n, side })),
        );
      }
      setNewName("");
      await fetchGuests();
    } catch (e) {
      console.error(e);
      alert("Lỗi khi thêm khách mời (có thể do trùng mã rút gọn, hãy thử lại)");
    } finally {
      setIsAddingGuest(false);
    }
  };

  const deleteGuest = async (id) => {
    if (!confirm("Xóa khách mời này?")) return;
    try {
      await adminApi.deleteInvitation(id);
      setGuests(guests.filter((g) => g.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const bulkDelete = async () => {
    if (
      !confirm(
        `Xóa ${selectedIds.length} khách mời đã chọn? Thao tác này không thể hoàn tác.`,
      )
    )
      return;
    try {
      await adminApi.bulkDeleteInvitations(selectedIds);
      setGuests(guests.filter((g) => !selectedIds.includes(g.id)));
      setSelectedIds([]);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked, filteredGuests) => {
    if (checked) {
      setSelectedIds(filteredGuests.map((g) => g.id));
    } else {
      setSelectedIds([]);
    }
  };

  const startEdit = (guest) => {
    setEditingId(guest.id);
    setEditValue(guest.name);
  };

  const saveEdit = async () => {
    const capitalizedName = capitalizeName(editValue);
    try {
      await adminApi.updateInvitation(editingId, capitalizedName);
      setGuests(
        guests.map((g) =>
          g.id === editingId ? { ...g, name: capitalizedName } : g,
        ),
      );
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const getLink = (guest) => {
    const origin = window.location.origin;
    if (guest.short_id) {
      const sidePath = guest.side === "bride" ? "/d" : "/r";
      return `${origin}${sidePath}/${guest.short_id}`;
    }
    const path = guest.side === "bride" ? "/d" : "/r";
    const params = new URLSearchParams();
    params.set("name", guest.name);

    return `${origin}${path}?${params.toString()}`;
  };

  const generateInvitation = (guest) => {
    const link = getLink(guest);
    return localTemplate
      .replaceAll("[name]", guest.name)
      .replaceAll("[link]", link);
  };

  const handleCopy = async (guest) => {
    const inviteHtml = generateInvitation(guest);
    navigator.clipboard.writeText(inviteHtml);

    try {
      await adminApi.markInvitationSent(guest.id, true);
      setGuests(
        guests.map((g) => (g.id === guest.id ? { ...g, is_sent: 1 } : g)),
      );
      // alert(`Đã copy lời mời cho: ${guest.name}`);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredGuests = guests.filter((g) => g.side === side);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top Header with Tabs */}
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex gap-2">
            <button
              onClick={() => setSide("groom")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                side === "groom"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              Nhà trai
            </button>
            <button
              onClick={() => setSide("bride")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                side === "bride"
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              Nhà gái
            </button>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={bulkDelete}
                className="text-[11px] font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors"
              >
                Xóa {selectedIds.length} mục
              </button>
            )}
            <Badge color={side === "groom" ? "blue" : "pink"}>
              {isLoadingGuests ? "..." : filteredGuests.length} khách mời
            </Badge>
          </div>
        </div>

        {/* Configuration Row: Template & Add Guest */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 sm:p-6 border-b border-gray-50 bg-gray-50/10">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-tight">Mẫu lời mời</h4>
              <button
                onClick={handleSaveTemplate}
                disabled={updateMutation.isPending}
                className="text-[10px] font-bold text-blue-600 disabled:opacity-50"
              >
                {updateMutation.isPending ? "..." : "LƯU MẪU"}
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={localTemplate}
              onChange={(e) => setLocalTemplate(e.target.value)}
              rows={2}
              className="w-full text-xs border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/20 bg-white"
            />
            <div className="flex gap-1">
              <button onClick={() => insertPlaceholder(" [name]")} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">[name]</button>
              <button onClick={() => insertPlaceholder(" [link]")} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">[link]</button>
            </div>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-tight">Thêm khách mời</h4>
            <form onSubmit={addGuest} className="flex flex-col gap-2">
              <textarea
                value={newName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Mỗi dòng 1 tên..."
                className="w-full text-xs border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                rows={2}
              />
              <button
                type="submit"
                disabled={!newName.trim() || isAddingGuest}
                className="w-full py-2 bg-gradient-to-r from-[#fd848e] to-[#f3425f] text-white rounded-lg text-[11px] font-bold shadow-sm"
              >
                {isAddingGuest ? "..." : "THÊM KHÁCH"}
              </button>
            </form>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="sm:hidden grid grid-cols-1 gap-3 p-3 bg-gray-50/50">
          {isLoadingGuests ? (
            <div className="py-12 text-center text-gray-400">Đang tải...</div>
          ) : filteredGuests.length === 0 ? (
            <div className="py-12 text-center text-gray-300 italic">Chưa có khách mời.</div>
          ) : (
            filteredGuests.map((guest) => (
              <div 
                key={guest.id}
                className={`p-3 bg-white rounded-xl border transition-all shadow-sm ${selectedIds.includes(guest.id) ? "border-primary ring-1 ring-primary/10 shadow-md shadow-primary/5" : "border-gray-100"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(guest.id)}
                      onChange={() => toggleSelect(guest.id)}
                      className="rounded border-gray-300"
                    />
                    <div>
                      {editingId === guest.id ? (
                        <div className="flex gap-1.5">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            className="text-xs border border-gray-200 rounded px-2 py-0.5 w-[100px]"
                          />
                          <button onClick={saveEdit} className="text-blue-500 font-bold text-[10px]">Lưu</button>
                        </div>
                      ) : (
                        <div className="font-bold text-gray-800 text-xs sm:text-sm">{guest.name}</div>
                      )}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] bg-gray-50 text-gray-400 px-1 py-0.5 rounded font-mono">
                          {guest.short_id}
                        </span>
                        {guest.is_sent === 1 && (
                          <span className="text-[9px] text-emerald-500 font-bold">
                            ✓ Đã Copy
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="p-1 text-rose-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-50">
                  <span className="text-[9px] text-gray-300 truncate max-w-[120px]">
                    /r/{guest.short_id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEdit(guest)}
                      className="p-1.5 text-gray-400 bg-gray-50 rounded-md"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleCopy(guest)}
                      className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg border ${
                        guest.is_sent
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-blue-500 text-white shadow-sm"
                      }`}
                    >
                      <Copy size={12} />
                      COPY
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-[11px] text-gray-400 uppercase tracking-wider">
                <th className="px-3 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredGuests.length > 0 &&
                      selectedIds.length === filteredGuests.length
                    }
                    onChange={(e) =>
                      handleSelectAll(e.target.checked, filteredGuests)
                    }
                    className="rounded border-gray-300 focus:ring-primary/20"
                  />
                </th>
                <th className="px-6 py-3 text-left">Tên khách mời</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Mã mời</th>
                <th className="px-6 py-3 text-left hidden lg:table-cell">Link chi tiết</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoadingGuests ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      selectedIds.includes(guest.id) ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(guest.id)}
                        onChange={() => toggleSelect(guest.id)}
                        className="rounded border-gray-300 focus:ring-primary/20"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {editingId === guest.id ? (
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none w-full max-w-[120px]"
                          />
                          <button
                            onClick={saveEdit}
                            className="text-blue-500 text-xs font-bold shrink-0"
                          >
                            Lưu
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700 text-sm">
                              {guest.name}
                            </span>
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded font-mono md:hidden">
                              {guest.short_id}
                            </span>
                          </div>
                          {guest.is_sent === 1 && (
                            <span className="text-[10px] text-emerald-500 font-medium">
                              ✓ Đã gửi/Copy
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                        {guest.short_id || "---"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <span className="text-[11px] text-gray-400 truncate">
                          {getLink(guest)}
                        </span>
                        <a
                          href={getLink(guest)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-300 hover:text-blue-500"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopy(guest)}
                          className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                            guest.is_sent
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                          }`}
                        >
                          <Copy size={13} />
                          {guest.is_sent ? "Đã Copy" : "Copy Lời mời"}
                        </button>
                        <button
                          onClick={() => startEdit(guest)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteGuest(guest.id)}
                          className="p-1.5 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa khách mời"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!isLoadingGuests && filteredGuests.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-300 text-sm italic"
                  >
                    Chưa có khách mời nào ở phía này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ImageManager = () => {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();
  const [uploading, setUploading] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);

  const SECTIONS = [
    {
      id: "opening_image",
      label: "Ảnh màn mở thiệp (Card)",
      section: "Opening",
    },
    { id: "hero_bg", label: "Ảnh nền Hero", section: "Hero" },
    { id: "hero_couple", label: "Ảnh cặp đôi Hero", section: "Hero" },
    { id: "bride_main", label: "Ảnh chính Cô dâu", section: "Profile" },
    { id: "bride_small_1", label: "Ảnh nhỏ 1 Cô dâu", section: "Profile" },
    { id: "bride_small_2", label: "Ảnh nhỏ 2 Cô dâu", section: "Profile" },
    { id: "groom_main", label: "Ảnh chính Chú rể", section: "Profile" },
    { id: "groom_small_1", label: "Ảnh nhỏ 1 Chú rể", section: "Profile" },
    { id: "groom_small_2", label: "Ảnh nhỏ 2 Chú rể", section: "Profile" },
  ];

  const safeParseGallery = (str) => {
    try {
      return str ? JSON.parse(str) : [];
    } catch (e) {
      console.error("Gallery parse error:", e);
      return [];
    }
  };

  const handleUpload = async (e, keyId, isGallery = false) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(keyId || "new_gallery");
    // Reset input so same file can be selected again
    const inputElement = e.target;

    try {
      if (isGallery) {
        let currentList = safeParseGallery(settings?.gallery_list);

        // Upload all files
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "didauday");

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/dklus9slm/image/upload`,
            formData,
          );
          currentList.push(res.data.secure_url);
        }

        await updateMutation.mutateAsync({
          key_name: "gallery_list",
          value_content: JSON.stringify(currentList),
        });
      } else {
        const file = files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "didauday");

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dklus9slm/image/upload`,
          formData,
        );

        await updateMutation.mutateAsync({
          key_name: keyId,
          value_content: res.data.secure_url,
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Lỗi upload ảnh");
    } finally {
      setUploading(null);
      inputElement.value = "";
    }
  };

  const handleDeleteGallery = async (index) => {
    if (!confirm("Xóa ảnh này khỏi album?")) return;
    const currentList = safeParseGallery(settings?.gallery_list);
    const newList = currentList.filter((_, i) => i !== index);
    await updateMutation.mutateAsync({
      key_name: "gallery_list",
      value_content: JSON.stringify(newList),
    });
    setSelectedIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const toggleSelect = (index) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIndices.length === 0) return;
    if (!confirm(`Xóa ${selectedIndices.length} ảnh đã chọn khỏi album?`))
      return;

    const currentList = safeParseGallery(settings?.gallery_list);
    const newList = currentList.filter((_, i) => !selectedIndices.includes(i));

    await updateMutation.mutateAsync({
      key_name: "gallery_list",
      value_content: JSON.stringify(newList),
    });
    setSelectedIndices([]);
  };

  const toggleSelectAll = (galleryList) => {
    if (selectedIndices.length === galleryList.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(galleryList.map((_, i) => i));
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-400 font-medium">
        Đang tải cấu hình ảnh...
      </div>
    );

  const groupedSections = SECTIONS.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const galleryList = safeParseGallery(settings?.gallery_list);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {Object.entries(groupedSections).map(([sectionName, items]) => (
        <div key={sectionName} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#fd848e] to-[#f3425f] rounded-full" />
            <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
              Section: {sectionName}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 group transition-all hover:shadow-md hover:border-pink-100"
              >
                <div className="aspect-[3/4] rounded-xl relative bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-50">
                  {settings?.[item.id] ? (
                    <img
                      src={settings[item.id]}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                    />
                  ) : (
                    <ImageIcon size={32} className="text-gray-200" />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none" />

                  {uploading === item.id && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                      <RefreshCw
                        className="text-primary animate-spin"
                        size={20}
                      />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h4 className="font-bold text-gray-800 text-[13px] line-clamp-1 mb-3">
                    {item.label}
                  </h4>

                  <label className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-50 hover:bg-primary hover:text-white rounded-xl text-[11px] font-bold text-gray-500 transition-all cursor-pointer group/label">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, item.id)}
                      disabled={uploading === item.id}
                    />
                    <Upload
                      size={14}
                      className={
                        uploading === item.id
                          ? "animate-bounce"
                          : "group-hover/label:rotate-12 transition-transform"
                      }
                    />
                    {uploading === item.id ? "ĐANG TẢI..." : "THAY ĐỔI ẢNH"}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Gallery Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#fd848e] to-[#f3425f] rounded-full" />
            <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
              Album Ảnh ({galleryList.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {galleryList.length > 0 && (
              <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-gray-100 mr-2">
                <button
                  onClick={() => toggleSelectAll(galleryList)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-[11px] font-bold text-gray-600"
                >
                  {selectedIndices.length === galleryList.length ? (
                    <>
                      <XCircle size={14} /> Bỏ chọn
                    </>
                  ) : (
                    <>
                      <CheckSquare size={14} /> Chọn tất cả
                    </>
                  )}
                </button>
                {selectedIndices.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all text-[11px] font-bold"
                  >
                    <Trash2 size={14} /> Xóa {selectedIndices.length} ảnh
                  </button>
                )}
              </div>
            )}

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg cursor-pointer hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleUpload(e, null, true)}
                disabled={uploading === "new_gallery"}
              />
              {uploading === "new_gallery" ? (
                <RefreshCw className="animate-spin" size={12} />
              ) : (
                <Upload size={12} />
              )}
              <span className="sm:inline hidden">THÊM NHIỀU ẢNH</span>
              <span className="sm:hidden">THÊM ẢNH</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 font-bold">
          {galleryList.map((url, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-0.5 shadow-sm border transition-all group relative cursor-pointer ${
                selectedIndices.includes(index)
                  ? "border-primary ring-2 ring-primary/10 shadow-sm"
                  : "border-gray-100"
              }`}
              onClick={() => toggleSelect(index)}
            >
              <div className="aspect-square rounded-md overflow-hidden relative border border-gray-50">
                <img
                  src={url}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />

                <div className="absolute top-1 right-1 flex flex-col gap-1 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGallery(index);
                    }}
                    className="p-1 bg-red-100/90 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-all sm:opacity-0"
                  >
                    <Trash2 size={10} />
                  </button>
                  <div
                    className={`p-0.5 rounded transition-all ${
                      selectedIndices.includes(index)
                        ? "bg-primary text-white"
                        : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <CheckSquare size={12} />
                  </div>
                </div>

                {selectedIndices.includes(index) && (
                  <div className="absolute inset-0 bg-primary/10 transition-all pointer-events-none" />
                )}
              </div>
            </div>
          ))}
          {galleryList.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-300 text-[10px] font-medium uppercase tracking-widest">Album trống</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
