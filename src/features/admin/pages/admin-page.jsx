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
  UserCheck,
  Upload
} from "lucide-react";
import { useSiteSettings, useUpdateSetting } from "../../../hooks/use-site-settings";
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
  const [rsvps, setRsvps] = useState([]);
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
  const [logGuestFilter, setLogGuestFilter] = useState("all");
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
      const [logsData, wishesData, rsvpsData] = await Promise.all([
        adminApi.getLogs(),
        adminApi.getAllWishes(),
        adminApi.getRSVP(),
      ]);
      setLogs(logsData);
      setWishes(wishesData);
      setRsvps(rsvpsData);
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

    // RSVP Stats
    const totalConfirmed = rsvps.filter(r => r.status === 'attending').length;
    const totalGuests = rsvps.filter(r => r.status === 'attending').reduce((acc, r) => acc + (r.count || 1), 0);
    const totalRemote = rsvps.filter(r => r.status === 'not_attending').length;

    return { total: totalLogs, opened, qrViewed, pctOpened, pctScrolled, totalVisits, totalConfirmed, totalGuests, totalRemote };
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

    let matchGuest = true;
    if (logGuestFilter === "identified") matchGuest = !!log.guest_name;
    else if (logGuestFilter === "anonymous") matchGuest = !log.guest_name;

    return matchPath && matchEvent && matchGuest;
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
    { id: "invitations", label: "Khách mời", icon: <Send size={15} /> },
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
            logGuestFilter={logGuestFilter}
            setLogGuestFilter={setLogGuestFilter}
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
        {tab === "images" && <GalleryTab isGroomSide={false} />}
      </div>
    </div>
  );
};

// Extracted Gallery Tab to keep AdminPage clean
const GalleryTab = ({ isGroomSide = false }) => {
  const { data: settings = {}, isLoading: settingsLoading } = useSiteSettings();
  const updateSetting = useUpdateSetting();
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [uploading, setUploading] = useState(false);

  const galleryList = useMemo(() => {
    try {
      const list = settings.gallery_list ? JSON.parse(settings.gallery_list) : [];
      return Array.isArray(list) ? list.filter(v => v) : [];
    } catch (e) {
      return [];
    }
  }, [settings.gallery_list]);

  const toggleSelect = useCallback((idx) => {
    setSelectedIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIndices(prev => 
      prev.length === galleryList.length ? [] : galleryList.map((_, i) => i)
    );
  }, [galleryList]);

  const handleUpload = async (e, targetKey = null) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(targetKey ? "section" : "new_gallery");
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dklus9slm";
    const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "didauday";

    try {
      const newUrls = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        
        if (data.secure_url) {
          if (targetKey) {
            // Update specific section image
            await updateSetting.mutateAsync({ 
              key_name: targetKey, 
              value_content: data.secure_url 
            });
          } else {
            newUrls.push(data.secure_url);
          }
        }
      }

      if (newUrls.length > 0) {
        // Update the JSON gallery_list
        const newList = [...galleryList, ...newUrls];
        await updateSetting.mutateAsync({ 
          key_name: "gallery_list", 
          value_content: JSON.stringify(newList) 
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  const handleDeleteGallery = async (index) => {
    if (!confirm("Xóa ảnh này?")) return;
    const newList = galleryList.filter((_, i) => i !== index);
    await updateSetting.mutateAsync({ 
      key_name: "gallery_list", 
      value_content: JSON.stringify(newList) 
    });
    setSelectedIndices(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const handleDeleteSelected = async () => {
    if (selectedIndices.length === 0) return;
    if (!confirm(`Xóa ${selectedIndices.length} ảnh đã chọn?`)) return;

    const newList = galleryList.filter((_, i) => !selectedIndices.includes(i));
    await updateSetting.mutateAsync({ 
      key_name: "gallery_list", 
      value_content: JSON.stringify(newList) 
    });
    setSelectedIndices([]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section Images Manager */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">Ảnh Giao Diện</h2>
          <span className="text-[10px] text-gray-400 font-medium">Cấu hình ảnh từng mục</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageSectionGroup title="Hero Section">
             <SectionImageRow label="Ảnh Nền (Hero)" settingKey="hero_bg" value={settings.hero_bg} onUpload={handleUpload} />
             <SectionImageRow label="Ảnh Cặp Đôi" settingKey="hero_couple" value={settings.hero_couple} onUpload={handleUpload} />
             <SectionImageRow label="Thumbnail (Chia sẻ)" settingKey="opening_image" value={settings.opening_image} onUpload={handleUpload} />
          </ImageSectionGroup>

          <ImageSectionGroup title="Cô Dâu">
             <SectionImageRow label="Ảnh Chính" settingKey="bride_main" value={settings.bride_main} onUpload={handleUpload} />
             <SectionImageRow label="Ảnh Phụ 1" settingKey="bride_small_1" value={settings.bride_small_1} onUpload={handleUpload} />
             <SectionImageRow label="Ảnh Phụ 2" settingKey="bride_small_2" value={settings.bride_small_2} onUpload={handleUpload} />
          </ImageSectionGroup>

          <ImageSectionGroup title="Chú Rể">
             <SectionImageRow label="Ảnh Chính" settingKey="groom_main" value={settings.groom_main} onUpload={handleUpload} />
             <SectionImageRow label="Ảnh Phụ 1" settingKey="groom_small_1" value={settings.groom_small_1} onUpload={handleUpload} />
             <SectionImageRow label="Ảnh Phụ 2" settingKey="groom_small_2" value={settings.groom_small_2} onUpload={handleUpload} />
          </ImageSectionGroup>
        </div>
      </div>

      <GalleryManager
        galleryList={galleryList}
        selectedIndices={selectedIndices}
        toggleSelect={toggleSelect}
        handleDeleteGallery={handleDeleteGallery}
        handleDeleteSelected={handleDeleteSelected}
        toggleSelectAll={toggleSelectAll}
        uploading={uploading}
        handleUpload={(e) => handleUpload(e, null)}
        hasFullControl={true}
        isGroomSide={isGroomSide}
      />
    </div>
  );
};

const ImageSectionGroup = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-l-2 border-primary/30 pl-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const SectionImageRow = ({ label, settingKey, value, onUpload }) => {
  const [localUploading, setLocalUploading] = useState(false);
  
  const handleInternalUpload = async (e) => {
    setLocalUploading(true);
    await onUpload(e, settingKey);
    setLocalUploading(false);
  };

  return (
    <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100 group">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
        <img src={value} alt={label} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-gray-700 truncate">{label}</p>
        <p className="text-[9px] text-gray-400 truncate font-mono">{settingKey}</p>
      </div>
      <label className="cursor-pointer bg-white p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95">
        <input type="file" className="hidden" accept="image/*" onChange={handleInternalUpload} />
        {localUploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
      </label>
    </div>
  );
};

export default AdminPage;
