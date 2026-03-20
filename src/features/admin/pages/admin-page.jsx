import React, { useState, useEffect } from "react";
import { adminApi } from "../api/admin-api";
import { Eye, EyeOff, Trash2, RefreshCw, LogOut, Users, MessageSquare, BarChart2 } from "lucide-react";

const ADMIN_PASS = "kaina2k";

const formatDate = (dt) =>
  new Date(dt).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });

const Badge = ({ children, color = "blue" }) => {
  const map = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-600",
    pink: "bg-pink-100 text-pink-700",
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[color]}`}>
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
        (w.id === wish.id ? { ...w, hidden: newHidden ? 1 : 0 } : w),
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
    const scrolled100 = filteredForStats.filter((l) => l.scroll_percent === 100).length;
    const qrViewed = filteredForStats.filter((l) => l.is_qr_viewed).length;
    const totalVisits = filteredForStats.reduce((acc, l) => acc + (l.visit_count || 1), 0);

    const pctOpened = totalLogs ? Math.round((opened / totalLogs) * 100) : 0;
    const pctScrolled = totalLogs ? Math.round((scrolled100 / totalLogs) * 100) : 0;

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
    else if (logEventFilter !== "all") matchEvent = log.event === logEventFilter;

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
    { id: "stats", label: "Thống kê", icon: <Users size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-800 text-base">💍 Admin Dashboard</h1>
            <p className="text-[11px] text-gray-400">Khai & Nga · 2026</p>
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

      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-5 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-[#fd848e] to-[#f3425f] text-white shadow"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.icon}
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-[11px] text-gray-400 uppercase tracking-wider">
                    <th className="px-5 py-3 text-left w-10">
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
                    <th className="px-5 py-3 text-left">Khách mời</th>
                    <th className="px-5 py-3 text-left">Tiến độ</th>
                    <th className="px-5 py-3 text-left">Lượt tập trung</th>
                    <th className="px-5 py-3 text-left">Path</th>
                    <th className="px-5 py-3 text-left">Cập nhật</th>
                    <th className="px-5 py-3 text-left w-10"></th>
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
                    const isSide = log.path?.includes("/r") || log.path?.includes("/groom") ? "groom" : (log.path?.includes("/d") || log.path?.includes("/bride") ? "bride" : "none");

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
                            <span className="text-gray-300 italic">Ẩn danh</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${log.visit_count > 0 ? 'bg-blue-400' : 'bg-gray-200'}`} title="Đã truy cập" />
                               <div className={`w-2 h-2 rounded-full ${log.is_opened ? 'bg-green-400' : 'bg-gray-200'}`} title="Đã mở thiệp" />
                               <div className={`w-2 h-2 rounded-full ${log.is_qr_viewed ? 'bg-pink-400' : 'bg-gray-200'}`} title="Đã xem QR" />
                               <span className="text-[10px] text-gray-400 ml-1 italic font-medium">({ev.label})</span>
                            </div>
                            {log.scroll_percent > 0 && (
                               <div className="flex items-center gap-1.5">
                                 <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-orange-400" style={{ width: `${log.scroll_percent}%` }} />
                                 </div>
                                 <span className="text-[9px] text-gray-400 font-mono">{log.scroll_percent}%</span>
                               </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 text-gray-600">
                             <span className="text-xs font-bold">{log.visit_count || 1}</span>
                             <span className="text-[10px] text-gray-400">lần</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs font-mono">
                          {isSide === "groom" ? (
                            <Badge color="blue">Chú rể</Badge>
                          ) : isSide === "bride" ? (
                            <Badge color="pink">Cô dâu</Badge>
                          ) : (
                            <span className="text-gray-300">/</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs">
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
            <div className="overflow-x-auto">
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
                            <span className="font-semibold text-gray-700">{wish.name}</span>
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
      </div>
    </div>
  );
};

export default AdminPage;
