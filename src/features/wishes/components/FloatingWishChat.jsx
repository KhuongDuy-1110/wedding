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
          toast.success("Gửi lời chúc thành công!");
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
    if (!wishes || wishes.length === 0) return;
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
    addNextWish();
  }, [wishes]);

  useEffect(() => {
    if (!wishes || wishes.length === 0) return;
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

      <div className="fixed inset-x-0 bottom-0 z-[90] pointer-events-none p-s20 pb-s10 md:pb-s40">
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
                className="flex flex-col justify-end gap-s8 px-s5 max-w-[85%] md:max-w-[55%] pointer-events-none"
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
                      className="bg-[rgba(225,117,117,0.5)]  text-[13px] md:text-[14px] px-s10 min-h-7 py-1 rounded-[15px] text-white shadow-lg pointer-events-auto w-fit max-w-full"
                    >
                      <span className="font-bold  mr-s4 ">{wish.name}: </span>
                      <span className=" pl-1 leading-relaxed">
                        {wish.message}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar + Toggle button on right — Capsule is now always present */}
          <motion.div
            layout
            className={`absolute right-0 flex flex-col items-center pointer-events-auto shadow-xl transition-all duration-300 bg-gradient-to-b from-[#fd848e] to-[#f3425f] p-1 rounded-full border-2 border-white/40 ${
              isOpen ? "bottom-[85px]" : "bottom-0"
            }`}
          >
            {/* Always show Avatar image */}
            <motion.div
              layout
              className="w-[32px] h-[32px] rounded-full border border-white overflow-hidden bg-white z-10 mb-1"
            >
              <img
                src="https://thieucuoi-demo.vercel.app/images/opening.jpg"
                alt="Couple"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=120&q=80";
                }}
              />
            </motion.div>

            <motion.button
              layout
              onClick={() => setIsOpen((o) => !o)}
              className="w-[32px] h-[32px] flex items-center justify-center text-white bg-transparent"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={16} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu size={16} strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Bottom action bar */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center gap-s10 pointer-events-auto h-[72px]"
              >
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 py-2 bg-[#f3425f]/50 backdrop-blur-md rounded-full px-s18 flex items-center justify-between text-white border border-white/20 hover:bg-black/50 transition-colors"
                >
                  <span className="text-[14px] opacity-80">
                    Gửi lời chúc...
                  </span>
                  <MessageSquareText size={18} />
                </button>

                <button className="w-[48px] py-2 bg-[#f3425f] backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-md">
                  <Gift size={22} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default FloatingWishChat;
