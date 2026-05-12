import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Heart, 
  Gift, 
  CalendarCheck,
  ChevronRight
} from "lucide-react";
import { useSubmitRSVP } from "../hooks/use-rsvp";

const RSVPModal = ({ isOpen, onClose, guestName, side, shortId }) => {
  const submitRSVP = useSubmitRSVP();

  const handleAttend = () => {
    submitRSVP.mutate({
      name: guestName || "Khách mời",
      status: "attending",
      count: 1,
      invitation_id: shortId,
      side: side,
      note: ""
    }, {
      onSuccess: () => {
        onClose();
        sessionStorage.setItem("rsvp_done", "true");
      }
    });
  };

  const handleMungTuXa = () => {
    submitRSVP.mutate({
      name: guestName || "Khách mời",
      status: "not_attending",
      count: 0,
      invitation_id: shortId,
      side: side,
      note: ""
    }, {
      onSuccess: () => {
        onClose();
        sessionStorage.setItem("rsvp_done", "true");
        // Set a flag to auto-flip the gifting card when scrolled
        sessionStorage.setItem("auto_flip_gifting", "true");
        
        setTimeout(() => {
          const element = document.getElementById("gifting-section");
          if (element) {
            const offset = (window.innerHeight - element.offsetHeight) / 2;
            const top = element.getBoundingClientRect().top + window.pageYOffset - (offset > 0 ? offset : 0);
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 800);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative bg-white rounded-[32px] w-full max-w-[420px] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-[160px] bg-primary/5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Heart size={120} className="text-primary fill-primary" />
            </div>
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="z-10"
            >
              <img src="/message-heart.png" alt="Heart" className="w-[140px] drop-shadow-xl" />
            </motion.div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-black transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-s30">
            <div className="text-center">
              <h3 className="font-brice text-[22px] text-primary mb-s10 uppercase tracking-wider">Xác nhận tham dự</h3>
              <p className="text-text-muted text-[14px] leading-relaxed mb-s30 italic">
                Chào <strong>{guestName || "bạn"}</strong>, gia đình Khương & Giang rất mong được đón tiếp sự hiện diện của bạn!
              </p>

              <div className="flex flex-col gap-4">
                <button 
                  disabled={submitRSVP.isPending}
                  onClick={handleAttend}
                  className="w-full py-s18 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {submitRSVP.isPending ? "ĐANG GỬI..." : (
                    <>
                      <CalendarCheck size={20} />
                      SẼ THAM DỰ !
                      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold" />
                    </>
                  )}
                </button>
                
                <button 
                  disabled={submitRSVP.isPending}
                  onClick={handleMungTuXa}
                  className="w-full py-s18 bg-white text-primary border-2 border-primary/20 rounded-full font-bold hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Gift size={20} />
                  DỰ ONLINE !
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RSVPModal;
