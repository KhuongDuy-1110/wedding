import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, MessageSquareText, Heart, MapPin, X } from "lucide-react";
import { adminApi } from "./features/admin/api/admin-api";
import confetti from "canvas-confetti";

// Import Components
import HeroSection from "./components/organisms/HeroSection";
import EventDetails from "./components/organisms/EventDetails";
import Gallery from "./components/organisms/Gallery";
import Gifting from "./components/organisms/Gifting";
import OpeningEffect from "./components/organisms/OpeningEffect";
import WeddingCountdown from "./components/organisms/WeddingCountdown";
import ProfileSection from "./components/organisms/ProfileSection";
import FloatingWishChat from "./features/wishes/components/FloatingWishChat";
import { Toaster } from "react-hot-toast";
import QuoteSection from "./components/organisms/QuoteSection";
import CalendarSection from "./components/organisms/CalendarSection";
import ThankYouSection from "./components/organisms/ThankYouSection";
import FloatingHearts from "./components/atoms/FloatingHearts";
import { trackEvent } from "./features/admin/utils/tracker";
import { useSiteSettings } from "./hooks/use-site-settings";
import SideCountdown from "./components/organisms/SideCountdown";
import RSVPTrigger from "./features/rsvp/components/RSVPTrigger";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [weddingSide, setWeddingSide] = useState("both");
  const [showMapModal, setShowMapModal] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [shortId, setShortId] = useState("");
  const audioRef = useRef(null);
  const { data: settings, isLoading: isSettingsLoading } = useSiteSettings();

  const hasTracked = useRef(false);

  // Image Preloading Logic
  useEffect(() => {
    if (!settings) return;

    // Safety timeout for loading state to prevent blank screen if resources fail
    const safetyTimeout = setTimeout(() => {
      setIsReady(true);
    }, 8000);

    const criticalImages = [
      settings.opening_image,
      settings.hero_couple,
      settings.bride_main,
      settings.groom_main,
      settings.bride_small_1,
      settings.bride_small_2,
      settings.groom_small_1,
      settings.groom_small_2,
      "/assets/background.webp",
      "/assets/net-dut.webp"
    ].filter(Boolean);

    let loadedCount = 0;
    const totalToLoad = criticalImages.length;

    if (totalToLoad === 0) {
      setIsReady(true);
      clearTimeout(safetyTimeout);
      return;
    }

    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setIsReady(true);
          clearTimeout(safetyTimeout);
        }
      };
      img.onerror = () => {
        loadedCount++; // Count as loaded even on error to avoid blocking forever
        if (loadedCount === totalToLoad) {
          setIsReady(true);
          clearTimeout(safetyTimeout);
        }
      };
    });

    return () => clearTimeout(safetyTimeout);
  }, [settings]);

  useEffect(() => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const potentialId = segments.length > 1 ? segments[1] : (segments.length === 1 ? segments[0] : null);

    if (window.location.pathname.includes("/d") || window.location.pathname.includes("/bride")) {
      setWeddingSide("bride");
    } else if (window.location.pathname.includes("/r") || window.location.pathname.includes("/groom")) {
      setWeddingSide("groom");
    } else {
      setWeddingSide("both");
    }

    // Logic for short_id (e.g. /ABC123 or /d/ABC123)
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name") || params.get("to");

    if (nameParam) {
      setGuestName(nameParam);
      sessionStorage.setItem("guest_name", nameParam);
    } else if (potentialId && potentialId.length >= 6 && potentialId.length <= 10) {
      setShortId(potentialId);
      // Try fetching by short_id
      const fetchGuest = async () => {
        try {
          const guest = await adminApi.getInvitationByShortId(potentialId);
          if (guest) {
            setGuestName(guest.name);
            setWeddingSide(guest.side);
            sessionStorage.setItem("guest_name", guest.name);
            trackEvent("page_visit");
          }
        } catch (e) {
          console.error("Short ID not found:", e);
        }
      };
      fetchGuest();
    } else {
      const stored = sessionStorage.getItem("guest_name");
      if (stored) setGuestName(stored);
    }

    if (!hasTracked.current) {
      trackEvent("page_visit");
      hasTracked.current = true;
    }

    // Track scroll depth
    const milestones = [25, 50, 75, 100];
    const reachedMilestones = new Set();

    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - winHeight;
      if (totalScrollable <= 0) return;

      const currentPercent = Math.min(
        100,
        Math.round((scrollY / totalScrollable) * 100),
      );

      milestones.forEach((m) => {
        if (currentPercent >= m && !reachedMilestones.has(m)) {
          reachedMilestones.add(m);
          trackEvent("scroll_depth", m);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (guestName) {
      document.title = `Thân mời ${guestName} - Đám Cưới Khải & Nga`;
    } else {
      document.title = "Đám Cưới Khải & Nga";
    }
  }, [guestName]);

  const weddingConfigs = {
    groom: {
      date: "04.04.2026",
      time: "THỨ BẢY - 10H00",
      targetDate: "2026-04-04T10:00:00",
    },
    bride: {
      date: "04.04.2026",
      time: "THỨ BẢY - 16H00",
      targetDate: "2026-04-04T16:00:00",
    },
    both: {
      date: "04.04.2026",
      time: "THỨ BẢY - 16H00",
      targetDate: "2026-04-04T16:00:00",
    },
  };

  const currentConfig = weddingConfigs[weddingSide];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.log("Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Replace this with your Google Apps Script URL
  const GOOGLE_SCRIPT_URL = "";

  const MAPS = {
    groom: "https://maps.app.goo.gl/6dSmA6fX7HCMgNuY7",
    bride: "https://maps.app.goo.gl/e6V69PFv2CKDWMbbA",
  };

  const handleOpenMap = (selectedSide) => {
    const s = selectedSide || weddingSide;
    if (s === "both" && !selectedSide) {
      setShowMapModal(true);
    } else {
      const url = MAPS[s] || MAPS.groom;
      // On mobile, opening in same tab avoids blank new-tab issue when launching apps
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      window.open(url, isMobile ? "_self" : "_blank");
      setShowMapModal(false);
    }
  };



  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
    trackEvent("open_invitation");
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#AF0E13", "#E7B547", "#ffffff"],
    });
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.8 },
      colors: ["#AF0E13", "#E7B547", "#ffffff"],
    });
    // Scroll to form if exists
    document
      .getElementById("rsvp-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isOpened) return;

    let requestRef;
    let isAutoScrolling = true;

    const stopAutoScroll = () => {
      if (!isAutoScrolling) return; 
      isAutoScrolling = false;
      if (requestRef) cancelAnimationFrame(requestRef);
      // Remove listeners once stopped
      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("touchstart", stopAutoScroll);
      window.removeEventListener("mousedown", stopAutoScroll);
      window.removeEventListener("keydown", stopAutoScroll);
    };

    const scrollFunc = () => {
      if (!isAutoScrolling) return;
      
      window.scrollBy(0, 0.4); // Very smooth scroll speed
      
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        stopAutoScroll();
        return;
      }

      requestRef = requestAnimationFrame(scrollFunc);
    };

    // Delay 3 seconds before starting auto-scroll after opening
    const timeoutId = setTimeout(() => {
      if (!isAutoScrolling) return;
      
      window.addEventListener("wheel", stopAutoScroll, { passive: true });
      window.addEventListener("touchstart", stopAutoScroll, { passive: true });
      window.addEventListener("mousedown", stopAutoScroll, { passive: true });
      window.addEventListener("keydown", stopAutoScroll, { passive: true });
      
      requestRef = requestAnimationFrame(scrollFunc);
    }, 3000); 

    return () => {
      clearTimeout(timeoutId);
      stopAutoScroll();
    };
  }, [isOpened]);

  return (
    <>
    <div
      className={`max-width-container relative ${
        isOpened
          ? "overflow-x-hidden overflow-y-auto h-auto"
          : "overflow-hidden h-screen"
      }`}
    >
      {/* Opening Effect (Envelope/Curtain) */}
      <OpeningEffect
        isOpened={isOpened}
        onOpen={handleOpen}
        coupleName="Phạm Khải & Lê Nga"
        date={currentConfig.date}
        isReady={isReady && !isSettingsLoading}
        heroImage={settings?.opening_image || settings?.hero_couple}
        guestName={guestName}
      />

      {/* Floating Audio Control */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className={`glass fixed top-s20 right-s20 z-[2001] w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer border-none ${isOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <img
          src="/assets/disk.png"
          alt="Music Disk"
          className="w-full h-full object-contain animate-[spin_3s_linear_infinite]"
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        />
        <style>{`@keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }`}</style>
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpened && (
          <div key="main-content">
            {/* Hero Section */}
            <HeroSection
              coupleName="Phạm Khải & Lê Nga"
              date={currentConfig.date}
              timeLabel={currentConfig.time}
              guestName={guestName}
            />

            {/* Profile Section */}
            <ProfileSection />

            {/* Quote Section */}
            <QuoteSection />

            {/* Countdown Section */}
            <div className="px-s20">
              <WeddingCountdown targetDate={currentConfig.targetDate} />
            </div>
            {/* Calendar Section */}
            <CalendarSection />

            {/* Main Content Area */}
            <main>
              <EventDetails side={weddingSide} />

              {/* Gallery Section */}
              <Gallery />
              {/* <div
                className="bg-[#111] text-[#ddd] py-s15 px-0 text-center text-xs tracking-[4px] uppercase"
              >
                {"<< Và thế giới đã mất đi 1 người cô đơn >>"}
              </div> */}

              {/* Gifting Section */}
              <Gifting side={weddingSide} />

              {/* Thank You Section */}
              <ThankYouSection />

              <footer className="py-s20 px-s24 text-center flex flex-col justify-center items-center">
                <h3 className="text-base  tracking-[2px] font-serif uppercase font-brice m-0 text-primary">
                  THANK YOU FOR WATCHING .<br />I HOPE YOU LIKE IT
                </h3>
              </footer>
            </main>

            <FloatingHearts />
          </div>
        )}
      </AnimatePresence>
    </div>
      <FloatingWishChat guestName={guestName} side={weddingSide} shortId={shortId} />
      <RSVPTrigger guestName={guestName} side={weddingSide} shortId={shortId} isOpened={isOpened} />
      <SideCountdown targetDate={currentConfig.targetDate} side={weddingSide} onOpenMap={() => handleOpenMap()} />
      <AnimatePresence>
        {showMapModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMapModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-white/20"
            >
              <button
                onClick={() => setShowMapModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider font-serif">Chọn Bản Đồ</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">Vui lòng chọn địa điểm bạn muốn đến</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleOpenMap("groom")}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Nhà Trai (Groom)
                </button>
                <button
                  onClick={() => handleOpenMap("bride")}
                  className="w-full py-3 bg-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                >
                  Nhà Gái (Bride)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src="/audio/i-do.mp3" loop />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
