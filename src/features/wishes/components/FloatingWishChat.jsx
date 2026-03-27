import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useWishes,
  useCreateWish,
  useUpdateWish,
  useRecallWish,
} from "../hooks/use-wishes";
import {
  MessageSquareText,
  X,
  Send,
  Loader2,
  RotateCcw,
  Edit2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";
import { getVisitorId } from "../../admin/utils/tracker";

const MAX_NAME_LENGTH = 25;
const MAX_MESSAGE_LENGTH = 200;

const getChatPath = (side) => {
  const path = window.location.pathname.toLowerCase();
  if (
    path === "/r" ||
    path.startsWith("/r/") ||
    path.includes("/groom") ||
    side === "groom"
  )
    return "/r";
  if (
    path === "/d" ||
    path.startsWith("/d/") ||
    path.includes("/bride") ||
    side === "bride"
  )
    return "/d";
  return "/";
};

const parseMessage = (side, rawMessage) => {
  let targetPath = getChatPath(side);
  let finalMessage = rawMessage.trim();
  let role = "GUEST";
  if (finalMessage.toLowerCase().startsWith("/r ")) {
    targetPath = "/r";
    role = "FAMILY_GROOM";
    finalMessage = finalMessage.substring(3).trim();
  } else if (finalMessage.toLowerCase().startsWith("/d ")) {
    targetPath = "/d";
    role = "FAMILY_BRIDE";
    finalMessage = finalMessage.substring(3).trim();
  } else if (finalMessage.toLowerCase() === "/r") {
    targetPath = "/r";
    role = "FAMILY_GROOM";
    finalMessage = "";
  } else if (finalMessage.toLowerCase() === "/d") {
    targetPath = "/d";
    role = "FAMILY_BRIDE";
    finalMessage = "";
  }
  return { targetPath, finalMessage, role };
};

const ENTER_TRANSITION = {
  opacity: { duration: 0.3 },
  x: { type: "tween", duration: 0.3 },
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
        <span className="font-bold mr-0.5 text-white">{wish.name}:</span>
        <span className="pl-1 leading-relaxed text-white">{wish.message}</span>

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
          ...formData,
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
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors:
                targetPath === "/r"
                  ? ["#3b82f6", "#2563eb", "#fff"]
                  : targetPath === "/d"
                    ? ["#fd848e", "#e85d79", "#fff"]
                    : ["#b39164", "#8d714b", "#fff"],
            });
            onSuccess?.(newWish);
          },
        },
      );
    }
  };

  const isGroomPath =
    getChatPath(side) === "/r" ||
    formData.message.toLowerCase().startsWith("/r ") ||
    formData.message.toLowerCase() === "/r";
  const isBridePath =
    getChatPath(side) === "/d" ||
    formData.message.toLowerCase().startsWith("/d ") ||
    formData.message.toLowerCase() === "/d";
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-t-[32px] w-full max-w-[500px] px-s30 pt-s50 pb-s40 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-s24 right-s24 text-[#5c1a1a] hover:opacity-70 transition-colors"
        >
          <X size={24} />
        </button>
        <div className="absolute -top-[50px] left-1/2 -translate-x-1/2">
          <img
            src="/message-heart.png"
            alt="Heart Icon"
            className="w-[180px] object-contain drop-shadow-xl"
          />
        </div>
        <h2 className="text-center text-[24px] font-bold text-[#333] mb-s24">
          {editWish ? "Sửa lời chúc" : "Lời chúc"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-s15">
          <input
            required
            disabled={!!editWish}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Tên của bạn"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full border border-[#5c1a1a]/30 bg-[#fdf5f6] rounded-[12px] px-s20 py-s15 text-[14px] text-[#333] placeholder-[#bbb] focus:outline-none focus:border-[#5c1a1a]/60 transition-colors ${editWish ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          <div className="relative">
            <textarea
              required
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Lời chúc của bạn"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={5}
              className="w-full border border-[#5c1a1a]/30 bg-[#fdf5f6] rounded-[12px] px-s20 py-s15 text-[14px] text-[#333] placeholder-[#bbb] focus:outline-none focus:border-[#5c1a1a]/60 transition-colors resize-none"
            />
            <span className="absolute bottom-2 right-3 text-[11px] text-[#999]">
              {formData.message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-s15 rounded-full text-white font-bold text-[16px] tracking-wide shadow-lg mt-s10 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-s10 ${isGroomPath ? "bg-gradient-to-r from-blue-500 to-blue-700 shadow-blue-500/30" : isBridePath ? "bg-gradient-to-r from-[#fd848e] to-[#e85d79] shadow-pink-200/50" : "bg-gradient-to-r from-[#b39164] to-[#8d714b] shadow-amber-900/20"}`}
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Send size={18} /> {editWish ? "Cập Nhật" : "Gửi Lời Chúc"}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const FloatingWishChat = ({ guestName, side, shortId }) => {
  const { data: wishes } = useWishes();
  const [activeWishes, setActiveWishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const idCounter = useRef(0);
  const createMutation = useCreateWish();
  const recallMutation = useRecallWish();
  const [selectedWishId, setSelectedWishId] = useState(null);
  const [editWish, setEditWish] = useState(null);
  const visitorId = useRef(getVisitorId()).current;
  const invitationId = shortId;

  const [desktopData, setDesktopData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return { name: guestName || params.get("name") || "", message: "" };
  });

  useEffect(() => {
    if (guestName) setDesktopData((prev) => ({ ...prev, name: guestName }));
  }, [guestName]);

  const currentPathType = getChatPath(side);
  const isGroomPath = currentPathType === "/r";
  const isBridePath = currentPathType === "/d";

  const addNextWish = useCallback(() => {
    if (!wishes || wishes.length === 0) return;
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
    if (activeWishes.length === 0) {
      indexRef.current = Math.floor(Math.random() * wishes.length);
      addNextWish();
    }
  }, [wishes, addNextWish]);

  useEffect(() => {
    if (!wishes || wishes.length === 0 || selectedWishId) return;
    timerRef.current = setInterval(addNextWish, 4000);
    return () => clearInterval(timerRef.current);
  }, [wishes, selectedWishId, addNextWish]);

  const handleDesktopSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!desktopData.name || !desktopData.message) return;
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
    [desktopData, side, createMutation, visitorId, invitationId],
  );

  const handleSelect = useCallback((wishId) => {
    setSelectedWishId((prev) => (prev === wishId ? null : wishId));
  }, []);

  const handleEdit = useCallback((wish) => {
    setEditWish(wish);
    setShowModal(true);
    setSelectedWishId(null);
  }, []);

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
            editWish={editWish}
            onSuccess={(updatedWish) => {
              if (editWish) {
                setActiveWishes((prev) =>
                  prev.map((w) =>
                    w.id === updatedWish.id ? { ...w, ...updatedWish } : w,
                  ),
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
        <div className="relative pointer-events-auto">
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
                className="hidden md:flex absolute top-5 right-6 text-[#5c1a1a] hover:opacity-70 transition-colors z-[12]"
              >
                <X size={20} />
              </button>
              <h2 className="hidden md:block text-center text-[20px] font-bold text-[#5c1a1a] mb-s20">
                Lời chúc
              </h2>

              <div className="flex flex-col justify-end items-start gap-s8 max-w-[85%] md:max-w-full min-h-[160px] md:min-h-[180px]">
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
                <div className="hidden md:block bg-[#5c1a1a]/5 p-s15 rounded-[16px] border border-[#5c1a1a]/10 backdrop-blur-sm">
                  <form
                    onSubmit={handleDesktopSubmit}
                    className="flex flex-col gap-s10"
                  >
                    <input
                      placeholder="Tên của bạn..."
                      maxLength={MAX_NAME_LENGTH}
                      value={desktopData.name}
                      onChange={(e) =>
                        setDesktopData({ ...desktopData, name: e.target.value })
                      }
                      className="w-full bg-[#fdf5f6] border border-[#5c1a1a]/20 rounded-xl px-s15 py-s8 text-[13px] text-[#333] focus:border-[#5c1a1a]/50 outline-none transition-all"
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="Lời nhắn gửi yêu thương..."
                        maxLength={MAX_MESSAGE_LENGTH}
                        value={desktopData.message}
                        onChange={(e) =>
                          setDesktopData({
                            ...desktopData,
                            message: e.target.value,
                          })
                        }
                        className="flex-1 bg-[#fdf5f6] border border-[#5c1a1a]/20 rounded-xl px-s15 py-s8 text-[13px] text-[#333] focus:border-[#5c1a1a]/50 outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className={`${isGroomPath || desktopData.message.toLowerCase().startsWith("/r") ? "bg-blue-600 shadow-blue-500/20" : isBridePath || desktopData.message.toLowerCase().startsWith("/d") ? "bg-[#fd848e] shadow-pink-500/20" : "bg-[#b39164] shadow-amber-900/20"} text-white p-s10 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shrink-0 shadow-lg`}
                      >
                        {createMutation.isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex items-center justify-end gap-s10">
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
                    className={`shrink-0 w-[44px] h-[44px] ${isGroomPath ? "bg-blue-600/40 shadow-blue-500/30" : isBridePath ? "bg-[#fd848e] shadow-pink-500/30" : "bg-[#b39164] shadow-amber-900/20"} text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform`}
                  >
                    {isOpen ? <X size={22} /> : <MessageSquareText size={22} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Toggle */}
          {!isOpen && (
            <div className="hidden md:flex justify-end">
              <button
                onClick={toggleOpen}
                className={`w-[56px] h-[56px] ${isGroomPath ? "bg-blue-600/40 shadow-blue-500/30" : isBridePath ? "bg-[#fd848e] shadow-pink-500/30" : "bg-[#b39164] shadow-amber-900/20"} text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform`}
              >
                <MessageSquareText size={28} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingWishChat;
