import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi } from "../api/admin-api";
import {
  LogOut,
  MessageSquare,
  BarChart2,
  Image as ImageIcon,
  Users,
  Send,
  RefreshCw,
} from "lucide-react";
import { formatDate, parseUA, capitalizeName } from "../utils/admin-helpers";
import { Badge } from "../components/badge";

// Components
import StatsCards from "../components/stats-cards";
import LogsTable from "../components/logs-table";
import WishesTable from "../components/wishes-table";
import InvitationManager from "../components/invitation-manager";
import GalleryManager from "../components/gallery-manager";

const ADMIN_PASS = "kaina2k";

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
    if (!confirm(`Xóa ${selectedLogs.length} lịch sử truy cập đã chọn?`)) return;
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
    if (!confirm(`Xóa vĩnh viễn ${selectedWishes.length} lời chúc đã chọn?`)) return;
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
      prev.map((w) => (w.id === wish.id ? { ...w, hidden: newHidden ? 1 : 0 } : w)),
    );
  };

  const logStats = () => {
    const filteredForStats = logs.filter((log) => {
      if (logPathFilter === "groom") return log.path?.includes("/r") || log.path?.includes("/groom");
      if (logPathFilter === "bride") return log.path?.includes("/d") || log.path?.includes("/bride");
      return true;
    });

    const totalLogs = filteredForStats.length;
    const opened = filteredForStats.filter((l) => l.is_opened).length;
    const scrolled100 = filteredForStats.filter((l) => l.scroll_percent === 100).length;
    const qrViewed = filteredForStats.filter((l) => l.is_qr_viewed).length;
    const totalVisits = filteredForStats.reduce((acc, l) => acc + (l.visit_count || 1), 0);
    const pctOpened = totalLogs ? Math.round((opened / totalLogs) * 100) : 0;
    const pctScrolled = totalLogs ? Math.round((scrolled100 / totalLogs) * 100) : 0;

    return { total: totalLogs, opened, qrViewed, pctOpened, pctScrolled, totalVisits };
  };

  const stats = logStats();

  const filteredLogs = logs.filter((log) => {
    let matchPath = true;
    if (logPathFilter === "groom") matchPath = log.path?.includes("/r") || log.path?.includes("/groom");
    else if (logPathFilter === "bride") matchPath = log.path?.includes("/d") || log.path?.includes("/bride");

    let matchEvent = true;
    if (logEventFilter === "opened") matchEvent = log.is_opened;
    else if (logEventFilter === "qr") matchEvent = log.is_qr_viewed;
    else if (logEventFilter !== "all") matchEvent = log.event === logEventFilter;

    return matchPath && matchEvent;
  });

  const filteredWishes = wishes
    .filter((w) => {
      const search = wishFilter.toLowerCase();
      const matchKeyword = w.name.toLowerCase().includes(search) || w.message.toLowerCase().includes(search);
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
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-sm:px-6">
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
            {passError && <p className="text-red-500 text-xs text-center">Mật khẩu không đúng</p>}
            <button type="submit" className="bg-gradient-to-r from-[#fd848e] to-[#f3425f] text-white font-bold py-3 rounded-xl shadow hover:opacity-90 transition-opacity">Đăng nhập</button>
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
            <h1 className="font-bold text-gray-800 text-sm sm:text-base">💍 Admin Dashboard</h1>
            <p className="text-[10px] sm:text-[11px] text-gray-400">Khai & Nga · 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} disabled={loading} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Làm mới
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={13} /> Thoát
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${tab === t.id ? "bg-gradient-to-r from-[#fd848e] to-[#f3425f] text-white shadow" : "text-gray-500 hover:text-gray-800"}`}
            >
              <span className="hidden sm:inline">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "stats" && <StatsCards stats={stats} />}
        {tab === "logs" && (
          <LogsTable 
            filteredLogs={filteredLogs}
            selectedLogs={selectedLogs}
            handleBulkDeleteLogs={handleBulkDeleteLogs}
            toggleSelectAllLogs={toggleSelectAllLogs}
            toggleSelectOneLog={toggleSelectOneLog}
            handleDeleteLog={handleDeleteLog}
            logEventFilter={logEventFilter}
            setLogEventFilter={setLogEventFilter}
            logPathFilter={logPathFilter}
            setLogPathFilter={setLogPathFilter}
          />
        )}
        {tab === "wishes" && (
          <WishesTable 
            filteredWishes={filteredWishes}
            selectedWishes={selectedWishes}
            toggleSelectOne={toggleSelectOne}
            toggleSelectAll={toggleSelectAll}
            handleDelete={handleDelete}
            handleBulkDelete={handleBulkDelete}
            handleToggleHide={handleToggleHide}
            wishFilter={wishFilter}
            setWishFilter={setWishFilter}
            wishSort={wishSort}
            setWishSort={setWishSort}
            wishStatusFilter={wishStatusFilter}
            setWishStatusFilter={setWishStatusFilter}
          />
        )}
        {tab === "invitations" && <InvitationManager />}
        {tab === "images" && <GalleryManager />}
      </div>
    </div>
  );
};

export default AdminPage;
