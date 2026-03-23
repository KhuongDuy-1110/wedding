import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, MessageSquareText, Heart } from "lucide-react";
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

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [weddingSide, setWeddingSide] = useState("both");
  const [isReady, setIsReady] = useState(false);
  const [guestName, setGuestName] = useState("");
  const audioRef = useRef(null);
  const { data: settings, isLoading: isSettingsLoading } = useSiteSettings();

  const hasTracked = useRef(false);

  // Image Preloading Logic
  useEffect(() => {
    if (!settings) return;

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
      return;
    }

    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        loadedCount++; // Count as loaded even on error to avoid blocking forever
        if (loadedCount === totalToLoad) {
          setIsReady(true);
        }
      };
    });
  }, [settings]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/d") || path.includes("/bride")) {
      setWeddingSide("bride");
    } else if (path.includes("/r") || path.includes("/groom")) {
      setWeddingSide("groom");
    } else {
      setWeddingSide("both");
    }

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || params.get("to");
    if (name) {
      setGuestName(name);
      document.title = `Báo Hỷ Khải Nga - Kính mời ${name}`;
      sessionStorage.setItem("guest_name", name);
    } else {
      document.title = "Báo Hỷ Khải Nga";
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

  const weddingConfigs = {
    groom: {
      date: "05.04.2026",
      time: "CHỦ NHẬT - 10H00",
      targetDate: "2026-04-05T10:00:00",
    },
    bride: {
      date: "04.04.2026",
      time: "THỨ BẢY - 16H00",
      targetDate: "2026-04-04T16:00:00",
    },
    both: {
      date: "05.04.2026",
      time: "CHỦ NHẬT - 10H00",
      targetDate: "2026-04-05T10:00:00",
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

      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Hero Section */}
            <HeroSection
              coupleName="Phạm Khải & Lê Nga"
              date={currentConfig.date}
              timeLabel={currentConfig.time}
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
            <FloatingWishChat />
            <SideCountdown targetDate={currentConfig.targetDate} />
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src="/audio/i-do.mp3" loop />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
