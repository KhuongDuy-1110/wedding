import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishes, useCreateWish, useUpdateWish, useRecallWish } from "../hooks/use-wishes";
import {
  MessageSquareText,
  Heart,
  Gift,
  ThumbsUp,
  X,
  Send,
  Menu,
  Loader2,
  RotateCcw,
  Edit2,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";

const MAX_NAME_LENGTH = 25;
const MAX_MESSAGE_LENGTH = 200;

const getChatPath = (side) => {
  const path = window.location.pathname.toLowerCase();

  // Strict checks for groom
  if (
    path === "/r" ||
    path.startsWith("/r/") ||
    path.includes("/groom") ||
    side === "groom"
  ) {
    return "/r";
  }

  // Strict checks for bride
  if (
    path === "/d" ||
    path.startsWith("/d/") ||
    path.includes("/bride") ||
    side === "bride"
  ) {
    return "/d";
  }

  return "/";
};

const WishModal = ({ onClose, onSuccess, guestName, side }) => {
  const [formData, setFormData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return { name: guestName || params.get("name") || "", message: "" };
  });

  useEffect(() => {
    if (guestName) {
      setFormData((prev) => ({ ...prev, name: guestName }));
    }
  }, [guestName]);
  const inputRef = useRef(null);
  const messageRef = useRef(null);
  const createMutation = useCreateWish();

  const handleSubmit = (e) => {
    e.preventDefault();

    const lastWishTime = localStorage.getItem("last_wish_send_time");
    const now = Date.now();
    const cooldownPeriod = 60000;

    if (lastWishTime && now - parseInt(lastWishTime) < cooldownPeriod) {
      const remaining = Math.ceil(
        (cooldownPeriod - (now - parseInt(lastWishTime))) / 1000,
      );
      toast.error(
        `Bạn vừa gửi lời chúc xong. Hãy quay lại sau ${remaining} giây nữa nhé!`,
      );
      return;
    }

    let targetPath = getChatPath(side);
    let finalMessage = formData.message.trim();
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

    if (!finalMessage && !formData.message.includes("/")) {
      toast.error("Vui lòng nhập lời chúc!");
      return;
    }

    createMutation.mutate(
      {
        ...formData,
        message: finalMessage || formData.message,
        role: role,
        phone: "",
        guest_path_name: targetPath,
        visitor_id: localStorage.getItem("visitor_id"),
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
                ? ["#3b82f6", "#2563eb", "#ffffff"]
                : targetPath === "/d"
                  ? ["#fd848e", "#e85d79", "#ffffff"]
                  : ["#b39164", "#8d714b", "#ffffff"],
          });
          onSuccess?.(newWish);
        },
      },
    );
  };

  const isGroomPath =
    getChatPath(side) === "/r" ||
    formData.message.toLowerCase().startsWith("/r ") ||
    formData.message.toLowerCase() === "/r";

  const isBridePath =
    getChatPath(side) === "/d" ||
    formData.message.toLowerCase().startsWith("/d ") ||
    formData.message.toLowerCase() === "/d";

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
          Lời chúc
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-s15">
          <input
            ref={inputRef}
            required
            maxLength={MAX_NAME_LENGTH}
            placeholder="Tên của bạn"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-[#5c1a1a]/30 bg-[#fdf5f6] rounded-[12px] px-s20 py-s15 text-[14px] text-[#333] placeholder-[#bbb] focus:outline-none focus:border-[#5c1a1a]/60 transition-colors"
          />
          <div className="relative">
            <textarea
              ref={messageRef}
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
            disabled={createMutation.isPending}
            className={`w-full py-s15 rounded-full text-white font-bold text-[16px] tracking-wide shadow-lg mt-s10 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-s10 ${
              isGroomPath
                ? "bg-gradient-to-r from-blue-500 to-blue-700 shadow-blue-500/30"
                : isBridePath
                  ? "bg-gradient-to-r from-[#fd848e] to-[#e85d79] shadow-pink-200/50"
                  : "bg-gradient-to-r from-[#b39164] to-[#8d714b] shadow-amber-900/20"
            }`}
          >
            {createMutation.isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Loader2 size={18} />
              </motion.div>
            ) : (
              <>
                <Send size={18} /> Gửi Lời Chúc
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const FloatingWishChat = ({ guestName, side }) => {
  const { data: wishes } = useWishes();
  const [activeWishes, setActiveWishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const idCounter = useRef(0);
  const createMutation = useCreateWish();
  const updateMutation = useUpdateWish();
  const recallMutation = useRecallWish();
  const [editingWishId, setEditingWishId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const visitorId = localStorage.getItem("visitor_id");

  const [desktopData, setDesktopData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return { name: guestName || params.get("name") || "", message: "" };
  });

  useEffect(() => {
    if (guestName) {
      setDesktopData((prev) => ({ ...prev, name: guestName }));
    }
  }, [guestName]);

  const currentPathType = getChatPath(side);
  const isGroomPath = currentPathType === "/r";
  const isBridePath = currentPathType === "/d";

  const addNextWish = () => {
    if (!wishes || wishes.length <= 5) return;
    const wish = wishes[indexRef.current % wishes.length];
    indexRef.current += 1;
    idCounter.current += 1;
    setActiveWishes((prev) => [
      ...prev.slice(-4),
      { ...wish, _key: idCounter.current },
    ]);
  };

  useEffect(() => {
    if (!wishes || wishes.length === 0) return;

    // Only initialize list if it's currently empty to avoid UI reset
    if (activeWishes.length === 0) {
      if (wishes.length <= 5) {
        setActiveWishes(
          wishes.map((w, idx) => ({ ...w, _key: `initial_${w.id}_${idx}` })),
        );
      } else {
        // Start from a random index to make it feel dynamic on load
        indexRef.current = Math.floor(Math.random() * wishes.length);
        addNextWish();
      }
    }
  }, [wishes]);

  useEffect(() => {
    if (!wishes || wishes.length <= 5 || editingWishId) return;
    timerRef.current = setInterval(addNextWish, 4000);
    return () => clearInterval(timerRef.current);
  }, [wishes, editingWishId]);

  const handleDesktopSubmit = (e) => {
    e.preventDefault();
    if (!desktopData.name || !desktopData.message) return;

    let targetPath = getChatPath(side);
    let finalMessage = desktopData.message.trim();
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

    createMutation.mutate(
      {
        ...desktopData,
        message: finalMessage || desktopData.message,
        role: role,
        phone: "",
        guest_path_name: targetPath,
        visitor_id: localStorage.getItem("visitor_id"),
      },
      {
        onSuccess: (newWish) => {
          setDesktopData({ ...desktopData, message: "" });
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
                ? ["#3b82f6", "#2563eb", "#ffffff"]
                : targetPath === "/d"
                  ? ["#fd848e", "#e85d79", "#ffffff"]
                  : ["#b39164", "#8d714b", "#ffffff"],
          });
        },
      },
    );
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <WishModal
            onClose={() => setShowModal(false)}
            guestName={guestName}
            side={side}
            onSuccess={(newWish) => {
              idCounter.current += 1;
              setActiveWishes((prev) => [
                ...prev.slice(-4),
                { ...newWish, _key: idCounter.current },
              ]);
            }}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed inset-x-0 md:right-s20 md:left-auto bottom-0 md:bottom-s20 z-[90] pointer-events-none p-s20 md:p-s15 pb-s10 md:pb-s15 w-full md:transition-all md:duration-500 ${isOpen ? "md:w-[420px]" : "md:w-auto"}`}
      >
        <div className="relative pointer-events-auto">
          {/* Main Chat Box */}
          {isOpen ? (
            <div
              className="relative bg-transparent md:bg-white md:backdrop-blur-none rounded-[32px] md:rounded-[18px] md:border-none md:border-[#eee] md:shadow-none md:shadow-[0_30px_60px_rgba(0,0,0,0.15)] py-s10 md:pt-s50 md:pb-s25 md:px-s25"
            >
              {/* Desktop Decorative Header (Like Mobile Modal) */}
              <div className="hidden md:block absolute -top-[45px] left-1/2 -translate-x-1/2 z-[11]">
                <img
                  src="/message-heart.png"
                  alt="Heart Icon"
                  className="w-[160px] object-contain drop-shadow-2xl"
                />
              </div>

              {/* Desktop Close Button (Top Right) */}
              <button
                onClick={() => setIsOpen(false)}
                className="hidden md:flex absolute top-5 right-6 text-[#5c1a1a] hover:opacity-70 transition-colors z-[12]"
              >
                <X size={20} />
              </button>

              {/* Desktop Title */}
              <h2 className="hidden md:block text-center text-[20px] font-bold text-[#5c1a1a] mb-s20">
                Lời chúc
              </h2>

              {/* Chat list area */}
              <div className="flex flex-col justify-end items-start gap-s8 max-w-[85%] md:max-w-full min-h-[160px] md:min-h-[180px]">
                <AnimatePresence mode="popLayout">
                  {activeWishes.map((wish) => (
                    <motion.div
                      key={wish._key}
                      layout="position"
                      initial={{ opacity: 0, x: 200 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, y: -60, scale: 0.9 }}
                      transition={{
                        layout: {
                          type: "spring",
                          damping: 25,
                          stiffness: 120,
                        },
                        opacity: { duration: 0.4 },
                        x: { type: "spring", damping: 25, stiffness: 120 },
                        y: { type: "spring", damping: 25, stiffness: 120 },
                      }}
                      className={`${
                        wish.guest_path_name === "/r"
                          ? "bg-blue-600/50 shadow-blue-500/10"
                          : wish.guest_path_name === "/d"
                            ? "bg-[#fd848e]/50 shadow-pink-500/10"
                            : "bg-[#b39164]/50 shadow-amber-900/5"
                      } text-[13px] md:text-[14px] px-s12 min-h-[30px] py-1.5 rounded-[18px] text-white shadow-lg backdrop-blur-[4px] w-fit max-w-[95%] pointer-events-auto border border-white/20`}
                    >
                      <span className="font-bold mr-s4 text-white/90">
                        {wish.name}:{" "}
                      </span>
                      {editingWishId === wish.id ? (
                        <div className="inline-flex items-center gap-2">
                          <input
                            autoFocus
                            className="bg-white/20 border border-white/30 rounded px-2 py-0.5 text-white outline-none min-w-[120px]"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateMutation.mutate({ id: wish.id, message: editingText, visitor_id: visitorId }, {
                                  onSuccess: () => setEditingWishId(null)
                                });
                              }
                              if (e.key === "Escape") setEditingWishId(null);
                            }}
                          />
                          <button 
                            onClick={() => updateMutation.mutate({ id: wish.id, message: editingText, visitor_id: visitorId }, {
                               onSuccess: () => setEditingWishId(null)
                            })}
                            className="hover:scale-110 active:scale-95"
                          >
                             <Send size={12} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="pl-1 leading-relaxed text-white">
                            {wish.message}
                          </span>
                          {wish.visitor_id === visitorId && (
                            <div className="inline-flex items-center gap-2 ml-2 opacity-50 hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingWishId(wish.id);
                                  setEditingText(wish.message);
                                }}
                                className="hover:text-blue-200"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if(confirm("Thu hồi lời chúc này?")) {
                                    recallMutation.mutate({ id: wish.id, visitor_id: visitorId });
                                  }
                                }}
                                className="hover:text-red-200"
                              >
                                <RotateCcw size={12} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
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
                        setDesktopData({
                          ...desktopData,
                          name: e.target.value,
                        })
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
                        className={`${
                          isGroomPath ||
                          desktopData.message.toLowerCase().startsWith("/r")
                            ? "bg-blue-600 shadow-blue-500/20"
                            : isBridePath ||
                                desktopData.message
                                  .toLowerCase()
                                  .startsWith("/d")
                              ? "bg-[#fd848e] shadow-pink-500/20"
                              : "bg-[#b39164] shadow-amber-900/20"
                        } text-white p-s10 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shrink-0 shadow-lg`}
                      >
                        {createMutation.isPending ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <Loader2 size={18} />
                          </motion.div>
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Mobile Layout Button Strip */}
                <div className="md:hidden flex items-center justify-end gap-s10">
                  <button
                    onClick={() => setShowModal(true)}
                    className={`flex-1 py-2.5 rounded-full px-s18 flex items-center justify-between text-white border border-white/30 backdrop-blur-sm ${
                      isGroomPath
                        ? "bg-blue-600/40"
                        : isBridePath
                          ? "bg-[#fd848e]/40"
                          : "bg-[#b39164]/40"
                    }`}
                  >
                    <span className="text-[14px] opacity-90 truncate">
                      Gửi lời chúc...
                    </span>
                    <MessageSquareText size={18} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`w-[48px] h-[48px] backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 shadow-md active:scale-95 transition-all ${
                      isGroomPath
                        ? "bg-blue-600/40"
                        : isBridePath
                          ? "bg-[#fd848e]/40"
                          : "bg-[#b39164]/40"
                    }`}
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Closed Trigger Icon (Same position as X button) */
            <button
              onClick={() => setIsOpen(true)}
              className={`w-[56px] h-[56px] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all ml-auto ${
                isGroomPath
                  ? "bg-blue-600/40 shadow-blue-500/30"
                  : isBridePath
                    ? "bg-[#fd848e] shadow-pink-500/30"
                    : "bg-[#b39164] shadow-amber-900/20"
              }`}
            >
              <MessageSquareText size={28} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingWishChat;
