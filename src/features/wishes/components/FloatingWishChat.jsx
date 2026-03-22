import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishes, useCreateWish } from "../hooks/use-wishes";
import {
  MessageSquareText,
  Heart,
  Gift,
  ThumbsUp,
  X,
  Send,
  Menu,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";

const WishModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return { name: params.get("name") || "", message: "" };
  });
  const inputRef = useRef(null);
  const messageRef = useRef(null);
  const createMutation = useCreateWish();

  useEffect(() => {
    // Smart auto focus: if name exists (from URL params), focus message
    if (formData.name) {
      setTimeout(() => {
        messageRef.current?.focus();
      }, 500); // Wait for animation
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Anti-spam check: 60s cooldown
    const lastWishTime = localStorage.getItem("last_wish_send_time");
    const now = Date.now();
    const cooldownPeriod = 60000; // 60 seconds

    if (lastWishTime && now - parseInt(lastWishTime) < cooldownPeriod) {
      const remaining = Math.ceil(
        (cooldownPeriod - (now - parseInt(lastWishTime))) / 1000,
      );
      toast.error(
        `Bạn vừa gửi lời chúc xong. Hãy quay lại sau ${remaining} giây nữa nhé!`,
      );
      return;
    }

    createMutation.mutate(
      { ...formData, role: "GUEST", phone: "" },
      {
        onSuccess: (newWish) => {
          localStorage.setItem("last_wish_send_time", Date.now().toString());
          onClose();
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#fd848e", "#e85d79", "#ffffff"],
          });
          onSuccess?.(newWish);
        },
      },
    );
  };

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
          className="absolute top-s24 right-s24 text-[#aaa] hover:text-[#666] transition-colors"
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
            placeholder="Tên của bạn"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-primary/30 bg-[#fdf5f6] rounded-[12px] px-s20 py-s15 text-[14px] text-[#333] placeholder-[#bbb] focus:outline-none focus:border-primary/60 transition-colors"
          />
          <textarea
            ref={messageRef}
            required
            placeholder="Lời chúc của bạn"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={5}
            className="w-full border border-primary/30 bg-[#fdf5f6] rounded-[12px] px-s20 py-s15 text-[14px] text-[#333] placeholder-[#bbb] focus:outline-none focus:border-primary/60 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-s15 rounded-full bg-gradient-to-r from-[#fd848e] to-[#e85d79] text-white font-bold text-[16px] tracking-wide shadow-lg shadow-primary/30 mt-s10 transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-s10"
          >
            {createMutation.isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                ⏳
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

const FloatingWishChat = () => {
  const { data: wishes } = useWishes();
  const [activeWishes, setActiveWishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [likeCount, setLikeCount] = useState(18);
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const idCounter = useRef(0);

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

    if (wishes.length <= 5) {
      // Just show all unique wishes without cycling
      setActiveWishes(
        wishes.map((w, idx) => ({ ...w, _key: `initial_${w.id}_${idx}` })),
      );
    } else {
      // Reset index and start cycling
      indexRef.current = 0;
      addNextWish();
    }
  }, [wishes]);

  useEffect(() => {
    // Only cycle if there are more than 5 wishes
    if (!wishes || wishes.length <= 5) return;

    timerRef.current = setInterval(addNextWish, 4000);
    return () => clearInterval(timerRef.current);
  }, [wishes]);

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <WishModal
            onClose={() => setShowModal(false)}
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

      <div className="fixed inset-x-0 md:right-auto md:left-s20 bottom-0 md:bottom-s20 z-[90] pointer-events-none p-s20 md:p-s15 pb-s10 md:pb-s15 w-full md:w-[400px] md:bg-white/10 md:backdrop-blur-md md:rounded-[32px] md:border md:border-white/20 md:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="relative">
          {/* Chat list */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="chatlist"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col justify-end items-start md:items-start gap-s8 px-s5 max-w-[85%] md:max-w-full pointer-events-none"
                style={{ minHeight: "220px" }}
              >
                <AnimatePresence mode="popLayout">
                  {activeWishes.map((wish) => (
                    <motion.div
                      key={wish._key}
                      layout
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 200,
                      }}
                      className="bg-[#f3425f]/50 text-[13px] md:text-[14px] px-s10 min-h-7 py-1 rounded-[15px] text-white shadow-lg pointer-events-auto w-fit max-w-full"
                    >
                      <span className="font-bold mr-s4">{wish.name}: </span>
                      <span className="pl-1 leading-relaxed">
                        {wish.message}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom action bar & Permanent Toggle */}
          <div className="flex items-center justify-end gap-s10 pointer-events-auto h-[48px] mt-s10 md:mt-2 relative">
            <AnimatePresence>
              {isOpen && (
                <motion.button
                  key="input-bar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setShowModal(true)}
                  className="flex-1 py-2 bg-[#f3425f]/60 backdrop-blur-md rounded-full px-s18 flex items-center justify-between text-white border border-white/20 hover:bg-[#f3425f]/80 transition-colors"
                >
                  <span className="text-[14px] opacity-90 truncate">Gửi lời chúc...</span>
                  <MessageSquareText size={18} />
                </motion.button>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-[48px] h-[48px] bg-[#f3425f]/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-md shrink-0 transition-transform active:scale-90"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close-icon"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat-icon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                  >
                    <MessageSquareText size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingWishChat;
