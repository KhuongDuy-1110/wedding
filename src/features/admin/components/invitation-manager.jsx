import React, { useState, useEffect, useRef } from "react";
import { Copy, Trash2, Edit2, Plus, RefreshCw, Send, CheckSquare, Square, XCircle, ExternalLink, UserCheck, Gift } from "lucide-react";
import { Badge } from "./badge";
import { adminApi } from "../api/admin-api";
import { useSiteSettings, useUpdateSetting } from "../../../hooks/use-site-settings";

const TEMPLATE_TYPES = ["bạn", "anh", "chị", "bạn thân", "em", "chú", "cô", "bác"];

const getSelfTitle = (guestTitle, side) => {
  const t = (guestTitle || "bạn").toLowerCase();
  if (t === "anh" || t === "chị") return "em";
  if (t === "chú" || t === "cô" || t === "bác") return "cháu";
  if (t === "em") return side === "groom" ? "anh" : "chị";
  return "mình"; // default for "bạn", "bạn thân"
};

const InvitationManager = () => {
  const { data: settings, isLoading: isSettingsLoading } = useSiteSettings();
  const updateMutation = useUpdateSetting();

  const [side, setSide] = useState("groom"); // groom or bride
  const [guests, setGuests] = useState([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [newName, setNewName] = useState("");
  const [newTemplateType, setNewTemplateType] = useState("bạn");
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editType, setEditType] = useState("");
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
          "Trân trọng kính mời [guest] [name] tới dự lễ cưới của [self] tại [link] !",
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

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const fetchGuests = async () => {
    setIsLoadingGuests(true);
    try {
      const data = await adminApi.getInvitations();
      setGuests(Array.isArray(data) ? data : []);
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
    setNewName(capitalizeName(val));
  };

  const addGuest = async (e) => {
    e.preventDefault();
    if (!newName.trim() || isAddingGuest) return;

    const names = newName
      .split("\n")
      .filter((n) => n.trim())
      .map((n) => n.trim());

    if (names.length === 0) {
      setNewName("");
      return;
    }

    setIsAddingGuest(true);
    try {
      if (names.length === 1) {
        await adminApi.createInvitation(names[0], side, newTemplateType);
      } else {
        await adminApi.bulkCreateInvitations(
          names.map((n) => ({ name: n, side, template_type: newTemplateType })),
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

  const handleSelectAll = (checked, filteredItems) => {
    if (checked) {
      setSelectedIds(filteredItems.map((g) => g.id));
    } else {
      setSelectedIds([]);
    }
  };

  const startEdit = (guest) => {
    setEditingId(guest.id);
    setEditValue(guest.name);
    setEditType(guest.template_type || "bạn");
  };

  const saveEdit = async () => {
    const capsName = capitalizeName(editValue);
    try {
      await adminApi.updateInvitation(editingId, capsName, editType);
      setGuests(
        guests.map((g) =>
          g.id === editingId ? { ...g, name: capsName, template_type: editType } : g,
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
    const guestTitle = guest.template_type || "bạn";
    const selfTitle = getSelfTitle(guestTitle, guest.side);
    
    return localTemplate
      .replaceAll("[name]", guest.name)
      .replaceAll("[link]", link)
      .replaceAll("[type]", guestTitle) // logic cũ
      .replaceAll("[guest]", guestTitle)
      .replaceAll("[self]", selfTitle);
  };

  const handleCopy = async (guest) => {
    const inviteHtml = generateInvitation(guest);
    navigator.clipboard.writeText(inviteHtml);

    try {
      await adminApi.markInvitationSent(guest.id, true);
      setGuests(
        guests.map((g) => (g.id === guest.id ? { ...g, is_sent: 1 } : g)),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filteredGuests = (guests || []).filter((g) => g.side === side);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-white relative z-10">
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 shadow-inner">
          <button
            onClick={() => setSide("groom")}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm ${
              side === "groom"
                ? "bg-white text-blue-500 shadow-md ring-1 ring-black/5"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            Nhà trai
          </button>
          <button
            onClick={() => setSide("bride")}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm ${
              side === "bride"
                ? "bg-white text-pink-500 shadow-md ring-1 ring-black/5"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            Nhà gái
          </button>
        </div>
        <div className="flex items-center gap-3">
          {filteredGuests.length > 0 && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredGuests.length && filteredGuests.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked, filteredGuests)}
                className="rounded border-gray-300 w-3.5 h-3.5"
              />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Tất cả</span>
            </label>
          )}
          {selectedIds.length > 0 && (
            <button
              onClick={bulkDelete}
              className="text-[10px] sm:text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-1.5 rounded-lg border border-rose-100 transition-all hover:bg-rose-100"
            >
              Xóa {selectedIds.length}
            </button>
          )}
          <Badge color={side === "groom" ? "blue" : "pink"}>
            {isLoadingGuests ? "..." : filteredGuests.length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 sm:p-6 border-b border-gray-50 bg-gray-50/10">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mẫu lời mời</h4>
            <button
              onClick={handleSaveTemplate}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-600 uppercase flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={11} /> Cập nhật
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={localTemplate}
            onChange={(e) => setLocalTemplate(e.target.value)}
            className="w-full h-[60px] sm:h-[80px] p-2 sm:p-3 text-[11px] sm:text-xs border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-600 bg-white"
            placeholder="Nhập mẫu tin nhắn..."
          />
          <div className="flex gap-1">
            <button onClick={() => insertPlaceholder("[guest]")} className="text-[9px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded" title="Ví dụ: Anh/Chị/Bạn">[guest]</button>
            <button onClick={() => insertPlaceholder("[self]")} className="text-[9px] bg-emerald-100 text-emerald-600 font-bold px-1.5 py-0.5 rounded" title="Ví dụ: Mình/Em/Cháu">[self]</button>
            <button onClick={() => insertPlaceholder("[name]")} className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">[name]</button>
            <button onClick={() => insertPlaceholder("[link]")} className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">[link]</button>
          </div>
        </div>
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thêm khách mời mới</h4>
          <form onSubmit={addGuest} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <textarea
                value={newName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Tên (mỗi dòng 1 tên)..."
                rows={2}
                className="flex-1 px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-bold text-gray-700 bg-white"
              />
              <div className="flex flex-col gap-1 w-[100px]">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Xưng hô (Khách)</span>
                <select 
                  value={newTemplateType}
                  onChange={(e) => setNewTemplateType(e.target.value)}
                  className="w-full text-[10px] border border-gray-100 rounded-lg px-1 py-1 outline-none font-bold text-gray-600 bg-white"
                >
                  {TEMPLATE_TYPES.map(t => (
                    <option key={t} value={t}>{t} ({getSelfTitle(t, side)})</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={!newName.trim() || isAddingGuest}
              className="w-full py-2 bg-gradient-to-r from-[#fd848e] to-[#f3425f] text-white rounded-lg text-[10px] sm:text-[11px] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all uppercase tracking-widest"
            >
              {isAddingGuest ? <RefreshCw className="animate-spin mx-auto" size={12} /> : "THÊM KHÁCH MỜI"}
            </button>
          </form>
        </div>
      </div>

      <div className="sm:hidden grid grid-cols-1 gap-2 p-2 bg-gray-50/20">
        {isLoadingGuests ? (
          <div className="py-12 text-center text-gray-400">Đang tải...</div>
        ) : filteredGuests.length === 0 ? (
          <div className="py-12 text-center text-gray-300 italic text-[11px]">Chưa có khách mời.</div>
        ) : (
          filteredGuests.map((guest) => {
            const guestTitle = guest.template_type || "bạn";
            const selfTitle = getSelfTitle(guestTitle, guest.side);
            return (
              <div 
                key={guest.id}
                className={`p-2 bg-white rounded-lg border transition-all shadow-sm ${selectedIds.includes(guest.id) ? "border-primary ring-1 ring-primary/10 shadow-md" : "border-gray-100"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(guest.id)}
                      onChange={() => toggleSelect(guest.id)}
                      className="rounded border-gray-300 w-3.5 h-3.5 shrink-0"
                    />
                    {editingId === guest.id ? (
                      <div className="flex flex-col gap-1 overflow-visible z-50">
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="text-[11px] border border-gray-200 rounded px-1.5 py-0.5 w-[120px]"
                        />
                        <select 
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          className="text-[10px] border border-gray-200 rounded px-1 py-0.5"
                        >
                          {TEMPLATE_TYPES.map(t => (
                            <option key={t} value={t}>{t} ({getSelfTitle(t, guest.side)})</option>
                          ))}
                        </select>
                        <button onClick={saveEdit} className="bg-blue-500 text-white rounded px-2 py-0.5 text-[10px] font-bold">Lưu</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 truncate">
                        <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0" title={`Tôi: ${selfTitle}`}>
                          [{guestTitle}]
                        </span>
                        <div className="font-bold text-gray-800 text-[11px] truncate">{guest.name}</div>
                      </div>
                    )}
                    {guest.is_sent === 1 && <span className="text-emerald-500 text-[10px] shrink-0 font-bold">✓</span>}
                  </div>
                  <button onClick={() => deleteGuest(guest.id)} className="text-rose-200 hover:text-rose-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-gray-400 font-mono bg-gray-50 px-1 rounded w-fit">{guest.short_id}</span>
                    {guest.rsvp_status ? (
                      <div className="flex items-center gap-1">
                        {guest.rsvp_status === 'attending' ? (
                          <span className="text-[9px] font-bold text-green-500 flex items-center gap-0.5"><UserCheck size={10}/> Tham dự {guest.rsvp_count > 1 ? `(${guest.rsvp_count})` : ''}</span>
                        ) : (
                          <span className="text-[9px] font-bold text-pink-500 flex items-center gap-0.5"><Gift size={10}/> Mừng từ xa</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[9px] text-gray-300 italic font-medium">Chưa phản hồi</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => startEdit(guest)} className="p-1 px-1.5 text-gray-400 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => handleCopy(guest)}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded border transition-all ${
                        guest.is_sent ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-500 text-white border-blue-600 shadow-sm"
                      }`}
                    >
                      <Copy size={11} /> {guest.is_sent ? "ĐÃ GỬI" : "COPY"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-[11px] text-gray-400 uppercase tracking-wider">
              <th className="px-3 py-3 text-center w-10">
                <input
                  type="checkbox"
                  checked={filteredGuests.length > 0 && selectedIds.length === filteredGuests.length}
                  onChange={(e) => handleSelectAll(e.target.checked, filteredGuests)}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left">Gọi khách / Xưng tôi</th>
              <th className="px-6 py-3 text-left">Tên khách mời</th>
              <th className="px-6 py-3 text-left">Phản hồi</th>
              <th className="px-6 py-3 text-left hidden md:table-cell">Mã mời</th>
              <th className="px-6 py-3 text-left hidden lg:table-cell">Link chi tiết</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoadingGuests ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Đang tải...</td></tr>
            ) : filteredGuests.map((guest) => (
              <tr key={guest.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(guest.id) ? "bg-primary/5" : ""}`}>
                <td className="px-3 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(guest.id)}
                    onChange={() => toggleSelect(guest.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  {editingId === guest.id ? (
                    <select 
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1"
                    >
                      {TEMPLATE_TYPES.map(t => (
                        <option key={t} value={t}>{t} ({getSelfTitle(t, guest.side)})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-500 font-bold text-[10px] uppercase border border-blue-100">
                        {guest.template_type || "bạn"}
                      </span>
                      <span className="text-gray-300">→</span>
                      <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-500 font-bold text-[10px] uppercase border border-emerald-100">
                        {getSelfTitle(guest.template_type, guest.side)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === guest.id ? (
                    <div className="flex gap-2">
                       <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit()} autoFocus className="text-sm border border-gray-200 rounded px-2 py-1" />
                       <button onClick={saveEdit} className="text-blue-500 font-bold">Lưu</button>
                       <button onClick={() => setEditingId(null)} className="text-gray-400">Hủy</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-gray-800">{guest.name}</span>
                       {guest.is_sent === 1 && <span className="text-emerald-500 font-bold text-xs shrink-0">✓ Đã gửi</span>}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {guest.rsvp_status ? (
                    <div className="flex flex-col gap-0.5">
                      {guest.rsvp_status === 'attending' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase w-fit">
                          <UserCheck size={10} /> Tham dự ({guest.rsvp_count})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 text-[10px] font-bold uppercase w-fit">
                          <Gift size={10} /> Mừng từ xa
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-300 italic">Chưa phản hồi</span>
                  )}
                </td>
                <td className="px-6 py-4 hidden md:table-cell"><span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{guest.short_id}</span></td>
                <td className="px-6 py-4 hidden lg:table-cell text-xs text-blue-400 italic">/{side === "groom" ? "r" : "d"}/{guest.short_id}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => startEdit(guest)} className="p-2 text-gray-400 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"><Edit2 size={16} /></button>
                    <button
                      onClick={() => handleCopy(guest)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        guest.is_sent ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" : "bg-blue-500 text-white border-blue-600 hover:bg-blue-600 shadow-md"
                      }`}
                    >
                      <Copy size={14} /> {guest.is_sent ? "COPY LẠI" : "COPY LỜI MỜI"}
                    </button>
                    <button onClick={() => deleteGuest(guest.id)} className="p-2 text-rose-300 bg-rose-50 rounded-lg hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvitationManager;
