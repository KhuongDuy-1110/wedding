import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import {
  MessageSquareText,
  X,
  Send,
  Loader2,
  Edit2,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useWishes,
  useCreateWish,
  useRecallWish,
  useUpdateWish,
} from "../hooks/use-wishes";
import { getVisitorId } from "../../admin/utils/tracker";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";

const MAX_NAME_LENGTH = 25;
const MAX_MESSAGE_LENGTH = 150;

const ENTER_TRANSITION = {
  opacity: { duration: 0.3 },
  x: { type: "tween", duration: 0.3, ease: "easeOut" },
};
const EXIT_TRANSITION = {
  opacity: { duration: 0.2 },
  y: { type: "tween", duration: 0.2 },
};
const LAYOUT_TRANSITION = { type: "tween", duration: 0.25 };

const WishBubble = memo(
  ({ wish, isMine, isSelected, onSelect, onEdit, onRecall, recallPending }) => {
    const bgClass =
      wish.guest_path_name === "/r"
        ? "bg-blue-600/50 shadow-blue-500/10"
        : wish.guest_path_name === "/d"
          ? "bg-[#fd848e]/50 shadow-pink-500/10"
          : "bg-[#b39164]/50 shadow-amber-900/5";

    return (
      <motion.div
        layout="position"
        initial={{ opacity: 0, x: 150 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{
          layout: LAYOUT_TRANSITION,
          ...ENTER_TRANSITION,
          ...(isSelected ? {} : EXIT_TRANSITION),
        }}
        onClick={isMine ? onSelect : undefined}
        className={`relative ${bgClass} text-[13px] md:text-[14px] px-3 min-h-[30px] py-1.5 rounded-[18px] text-white shadow-lg backdrop-blur-[4px] w-fit max-w-[95%] pointer-events-auto border border-white/20 ${isMine ? "cursor-pointer active:scale-95" : ""}`}
      >
        <span className="font-bold mr-1 text-white">{wish.name}:</span>
        <span className="leading-relaxed text-white break-words">{wish.message}</span>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-2 bg-white rounded-xl shadow-2xl p-1 flex gap-1 z-[100] border border-gray-100 w-max"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onEdit}
                className="px-3 py-1.5 text-[12px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Edit2 size={12} /> Sửa
              </button>
              <div className="w-[1px] bg-gray-100 self-stretch my-1" />
              <button
                onClick={onRecall}
                className="px-3 py-1.5 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {recallPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RotateCcw size={12} />
                )}{" "}
                Thu hồi
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);

const WishModal = ({
  onClose,
  onSuccess,
  guestName,
  side,
  invitationId,
  editWish,
}) => {
  const [formData, setFormData] = useState(() => {
    if (editWish) return { name: editWish.name, message: editWish.message };
    const params = new URLSearchParams(window.location.search);
    return { name: guestName || params.get("name") || "", message: "" };
  });

  useEffect(() => {
    if (guestName && !editWish)
      setFormData((prev) => ({ ...prev, name: guestName }));
  }, [guestName, editWish]);

  const createMutation = useCreateWish();
  const updateMutation = useUpdateWish();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editWish) {
      const lastWishTime = localStorage.getItem("last_wish_send_time");
      const now = Date.now();
      if (lastWishTime && now - parseInt(lastWishTime) < 60000) {
        toast.error(
          `Bạn vừa gửi lời chúc xong. Hãy quay lại sau ${Math.ceil((60000 - (now - parseInt(lastWishTime))) / 1000)} giây nữa nhé!`,
        );
        return;
      }
    }

    const { targetPath, finalMessage, role } = parseMessage(
      side,
      formData.message,
    );

    if (!finalMessage && !formData.message.includes("/")) {
      toast.error("Vui lòng nhập lời chúc!");
      return;
    }

    if (editWish) {
      updateMutation.mutate(
        {
          id: editWish.id,
          message: finalMessage || formData.message,
          visitor_id: getVisitorId(),
          invitation_id: invitationId,
        },
        {
          onSuccess: () => {
            onClose();
            onSuccess?.({
              ...editWish,
              message: finalMessage || formData.message,
            });
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          name: formData.name,
          message: finalMessage || formData.message,
          role,
          phone: "",
          guest_path_name: targetPath,
          visitor_id: getVisitorId(),
          invitation_id: invitationId,
        },
        {
          onSuccess: (newWish) => {
            localStorage.setItem("last_wish_send_time", Date.now().toString());
            onClose();
            onSuccess?.(newWish);
          },
        },
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-s20 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[24px] w-full max-w-[400px] overflow-hidden shadow-2xl"
      >
        <div className="p-s20 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#5c1a1a]">
            {editWish ? "Sửa lời chúc" : "Gửi lời chúc"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-s20 space-y-s15">
          <div className="space-y-s5">
            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider pl-1">
              Họ tên của bạn
            </label>
            <input
              required
              maxLength={MAX_NAME_LENGTH}
              disabled={!!editWish}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-[#fdf5f6] border border-[#5c1a1a]/10 rounded-xl px-s15 py-s10 text-[14px] text-[#333] outline-none focus:border-[#5c1a1a]/30 transition-all ${editWish ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Nhập tên..."
            />
          </div>
          <div className="space-y-s5">
            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider pl-1">
              Lời nhắn gửi
            </label>
            <textarea
              required
              maxLength={MAX_MESSAGE_LENGTH}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={3}
              className="w-full bg-[#fdf5f6] border border-[#5c1a1a]/10 rounded-xl px-s15 py-s10 text-[14px] text-[#333] outline-none focus:border-[#5c1a1a]/30 transition-all resize-none"
              placeholder="Viết lời chúc..."
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className={`w-full py-s12 rounded-xl text-white font-bold text-[14px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
              side === "groom" ? "bg-blue-600 shadow-blue-500/20" : "bg-[#fd848e] shadow-pink-500/20"
            }`}
          >
            {(createMutation.isPending || updateMutation.isPending) ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={18} />
            )}
            {editWish ? "CẬP NHẬT" : "GỬI LỜI CHÚC"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const getChatPath = (side) => {
  const path = window.location.pathname;
  if (path.includes("/r")) return "/r";
  if (path.includes("/d")) return "/d";
  return side === "groom" ? "/r" : "/d";
};

const parseMessage = (side, message) => {
  let finalMessage = message;
  let targetPath = getChatPath(side);
  let role = "friend";

  if (message.startsWith("/r ")) {
    finalMessage = message.substring(3);
    targetPath = "/r";
    role = "groom_family";
  } else if (message.startsWith("/d ")) {
    finalMessage = message.substring(3);
    targetPath = "/d";
    role = "bride_family";
  }

  return { targetPath, finalMessage, role };
};

const FloatingWishChat = ({ guestName, side, invitationId }) => {
  const { data: wishes } = useWishes();
  const createMutation = useCreateWish();
  const updateMutation = useUpdateWish();
  const recallMutation = useRecallWish();

  const [isOpen, setIsOpen] = useState(true);
  const [activeWishes, setActiveWishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWishId, setSelectedWishId] = useState(null);
  const [editWish, setEditWish] = useState(null);
  const [desktopData, setDesktopData] = useState({ name: "", message: "" });
  const desktopMessageRef = useRef(null);

  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const idCounter = useRef(0);
  const visitorId = useMemo(() => getVisitorId(), []);

  useEffect(() => {
    if (guestName) setDesktopData((prev) => ({ ...prev, name: guestName }));
  }, [guestName]);

  const currentPathType = getChatPath(side);
  const isGroomPath = currentPathType === "/r";
  const isBridePath = currentPathType === "/d";

  const addNextWish = useCallback(() => {
    if (!wishes || wishes.length === 0) return;
    
    // Nếu dưới 5 lời chúc, chỉ hiện thị hết 1 lượt rồi thôi, hoặc là không loop
    if (wishes.length < 5 && indexRef.current >= wishes.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      return; 
    }

    const wish = wishes[indexRef.current % wishes.length];
    indexRef.current += 1;
    idCounter.current += 1;
    setActiveWishes((prev) => [
      ...prev.slice(-4),
      { ...wish, _key: idCounter.current },
    ]);
  }, [wishes]);

  useEffect(() => {
    if (!wishes || wishes.length === 0) return;
    
    // Reset state khi data thay đổi (quan trọng)
    if (activeWishes.length === 0) {
      indexRef.current = 0;
      addNextWish();
    }
  }, [wishes, activeWishes.length, addNextWish]);

  useEffect(() => {
    if (!wishes || wishes.length === 0 || selectedWishId) return;
    
    // Nếu < 5 và đã hiện hết thì không chạy timer
    if (wishes.length < 5 && indexRef.current >= wishes.length) return;

    timerRef.current = setInterval(addNextWish, 3500);
    return () => clearInterval(timerRef.current);
  }, [wishes, selectedWishId, addNextWish]);

  const handleDesktopSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!desktopData.name || !desktopData.message) return;

      if (editWish) {
        updateMutation.mutate(
          {
            id: editWish.id,
            message: desktopData.message.trim(),
            visitor_id: visitorId,
            invitation_id: invitationId,
          },
          {
            onSuccess: () => {
              setActiveWishes((prev) =>
                prev.map((w) =>
                  w.id === editWish.id
                    ? { ...w, message: desktopData.message.trim() }
                    : w,
                ),
              );
              setDesktopData((prev) => ({ ...prev, message: "" }));
              setEditWish(null);
            },
          },
        );
        return;
      }

      const { targetPath, finalMessage, role } = parseMessage(
        side,
        desktopData.message,
      );
      createMutation.mutate(
        {
          ...desktopData,
          message: finalMessage || desktopData.message,
          role,
          phone: "",
          guest_path_name: targetPath,
          visitor_id: visitorId,
          invitation_id: invitationId,
        },
        {
          onSuccess: (newWish) => {
            setDesktopData((prev) => ({ ...prev, message: "" }));
            idCounter.current += 1;
            setActiveWishes((prev) => [
              ...prev.slice(-4),
              { ...newWish, _key: idCounter.current },
            ]);
            confetti({
              particleCount: 100,
              spread: 50,
              origin: { x: 0.9, y: 0.9 },
              colors:
                targetPath === "/r"
                  ? ["#3b82f6", "#2563eb", "#fff"]
                  : targetPath === "/d"
                    ? ["#fd848e", "#e85d79", "#fff"]
                    : ["#b39164", "#8d714b", "#fff"],
            });
          },
        },
      );
    },
    [desktopData, side, createMutation, updateMutation, editWish, visitorId, invitationId],
  );

  const handleSelect = useCallback((wishId) => {
    setSelectedWishId((prev) => (prev === wishId ? null : wishId));
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleEdit = useCallback(
    (wish) => {
      setSelectedWishId(null);
      if (isMobile) {
        setEditWish(wish);
        setShowModal(true);
      } else {
        setEditWish(wish);
        setDesktopData((prev) => ({ ...prev, message: wish.message }));
        setTimeout(() => desktopMessageRef.current?.focus(), 50);
      }
    },
    [isMobile],
  );

  const handleRecall = useCallback(
    (wish) => {
      if (confirm("Thu hồi lời chúc này?")) {
        recallMutation.mutate(
          { id: wish.id, visitor_id: visitorId, invitation_id: invitationId },
          {
            onSuccess: () => {
              setActiveWishes((prev) => prev.filter((w) => w.id !== wish.id));
              setSelectedWishId(null);
            },
          },
        );
      }
    },
    [recallMutation, visitorId, invitationId],
  );

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <WishModal
            onClose={() => {
              setShowModal(false);
              setEditWish(null);
            }}
            guestName={guestName}
            side={side}
            invitationId={invitationId}
            onSuccess={(updatedWish) => {
              if (editWish) {
                setActiveWishes((prev) =>
                  prev.map((w) => (w.id === updatedWish.id ? updatedWish : w)),
                );
              } else {
                idCounter.current += 1;
                setActiveWishes((prev) => [
                  ...prev.slice(-4),
                  { ...updatedWish, _key: idCounter.current },
                ]);
              }
            }}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed inset-x-0 md:right-s20 md:left-auto bottom-0 md:bottom-s20 z-[90] pointer-events-none p-s20 md:p-s15 pb-s10 md:pb-s15 w-full md:transition-all md:duration-500 ${isOpen ? "md:w-[420px]" : "md:w-auto"}`}
        onClick={() => setSelectedWishId(null)}
      >
        <div className="relative pointer-events-none">
          {isOpen && (
            <div className="relative bg-transparent md:bg-white md:backdrop-blur-none rounded-[32px] md:rounded-[18px] md:border-none md:border-[#eee] md:shadow-none md:shadow-[0_30px_60px_rgba(0,0,0,0.15)] py-s10 md:pt-s50 md:pb-s25 md:px-s25">
              <div className="hidden md:block absolute -top-[45px] left-1/2 -translate-x-1/2 z-[11]">
                <img
                  src="/message-heart.png"
                  alt="Heart Icon"
                  className="w-[160px] object-contain drop-shadow-2xl"
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hidden md:flex absolute top-5 right-6 text-[#5c1a1a] hover:opacity-70 transition-colors z-[12] pointer-events-auto"
              >
                <X size={20} />
              </button>
              <h2 className="hidden md:block text-center text-[20px] font-bold text-[#5c1a1a] mb-s20">
                Lời chúc
              </h2>

              <div className="flex flex-col justify-end items-start gap-s8 max-w-[85%] md:max-w-full h-[260px] md:h-[320px] overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {activeWishes.map((wish) => {
                    const isMine =
                      wish.visitor_id === visitorId ||
                      (wish.invitation_id === invitationId && !!invitationId);
                    return (
                      <WishBubble
                        key={wish._key}
                        wish={wish}
                        isMine={isMine}
                        isSelected={selectedWishId === wish.id}
                        onSelect={(e) => {
                          e.stopPropagation();
                          handleSelect(wish.id);
                        }}
                        onEdit={() => handleEdit(wish)}
                        onRecall={() => handleRecall(wish)}
                        recallPending={recallMutation.isPending}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Action Form Footer */}
              <div className="mt-s15 md:mt-4">
                {/* Desktop Form */}
                <div className={`hidden md:block p-s15 rounded-[16px] border backdrop-blur-sm transition-all pointer-events-auto ${editWish ? "bg-blue-50/80 border-blue-300/40" : "bg-[#5c1a1a]/5 border-[#5c1a1a]/10"}`}>
                  {editWish && (
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[12px] font-bold text-blue-600">Đang sửa lời chúc...</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditWish(null);
                          setDesktopData((prev) => ({ ...prev, message: "" }));
                        }}
                        className="text-[12px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <X size={12} /> Hủy
                      </button>
                    </div>
                  )}
                  <form
                    onSubmit={handleDesktopSubmit}
                    className="flex flex-col gap-s10"
                  >
                    <input
                      placeholder="Tên của bạn..."
                      maxLength={MAX_NAME_LENGTH}
                      value={desktopData.name}
                      disabled={!!editWish}
                      onChange={(e) =>
                        setDesktopData({ ...desktopData, name: e.target.value })
                      }
                      className={`w-full bg-[#fdf5f6] border border-[#5c1a1a]/20 rounded-xl px-s15 py-s8 text-[13px] text-[#333] focus:border-[#5c1a1a]/50 outline-none transition-all ${editWish ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    <div className="flex gap-2">
                      <input
                        ref={desktopMessageRef}
                        placeholder="Lời nhắn gửi yêu thương..."
                        maxLength={MAX_MESSAGE_LENGTH}
                        value={desktopData.message}
                        onChange={(e) =>
                          setDesktopData({
                            ...desktopData,
                            message: e.target.value,
                          })
                        }
                        className={`flex-1 bg-[#fdf5f6] border rounded-xl px-s15 py-s8 text-[13px] text-[#333] outline-none transition-all ${editWish ? "border-blue-400/50 focus:border-blue-500" : "border-[#5c1a1a]/20 focus:border-[#5c1a1a]/50"}`}
                      />
                      <button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className={`${editWish ? "bg-blue-600 shadow-blue-500/20" : isGroomPath || desktopData.message.toLowerCase().startsWith("/r") ? "bg-blue-600 shadow-blue-500/20" : isBridePath || desktopData.message.toLowerCase().startsWith("/d") ? "bg-[#fd848e] shadow-pink-500/30" : "bg-[#b39164] shadow-amber-900/20"} text-white p-s10 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shrink-0 shadow-lg`}
                      >
                        {(createMutation.isPending || updateMutation.isPending) ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : editWish ? (
                          <Edit2 size={18} />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex items-center justify-end gap-s10 pointer-events-auto">
                  <AnimatePresence>
                    {isOpen && (
                      <motion.button
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setShowModal(true)}
                        className={`flex-1 h-[44px] rounded-full px-s20 flex items-center justify-between text-white border border-white/30 backdrop-blur-sm shadow-xl active:scale-95 transition-all ${isGroomPath ? "bg-blue-600/40" : isBridePath ? "bg-[#fd848e]/40" : "bg-[#b39164]/40"}`}
                      >
                        <span className="text-[14px] font-medium opacity-90 truncate">
                          Gửi lời chúc...
                        </span>
                        <MessageSquareText size={20} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={toggleOpen}
                    className={`shrink-0 w-[44px] h-[44px] ${isGroomPath ? "bg-blue-600/40 shadow-blue-500/30" : isBridePath ? "bg-[#fd848e] shadow-pink-500/30" : "bg-[#b39164] shadow-amber-900/20"} text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform pointer-events-auto`}
                  >
                    {isOpen ? <X size={22} /> : <MessageSquareText size={22} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop/Mobile Toggle when closed */}
          {!isOpen && (
            <div className="flex justify-end">
              <button
                onClick={toggleOpen}
                className={`w-[48px] h-[48px] md:w-[56px] md:h-[56px] ${isGroomPath ? "bg-blue-600/40 shadow-blue-500/30" : isBridePath ? "bg-[#fd848e] shadow-pink-500/30" : "bg-[#b39164] shadow-amber-900/20"} text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform pointer-events-auto`}
              >
                <MessageSquareText className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingWishChat;
