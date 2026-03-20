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
import WishForm from "./components/organisms/WishForm";
import ProfileSection from "./components/organisms/ProfileSection";
import QuoteSection from "./components/organisms/QuoteSection";
import CalendarSection from "./components/organisms/CalendarSection";
import ThankYouSection from "./components/organisms/ThankYouSection";
import FloatingHearts from "./components/atoms/FloatingHearts";
import ScrollToTop from "./components/atoms/ScrollToTop";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef(null);

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
        date="05.04.2026"
      />

      {/* Floating Audio Control */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className={`glass fixed bottom-s20 left-s20 z-[100] w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer border-none ${isOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
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
            <HeroSection coupleName="Phạm Khải & Lê Nga" date="05.04.2026" />

            {/* Profile Section */}
            <ProfileSection />

            {/* Quote Section */}
            <QuoteSection />

            {/* Countdown Section */}
            <div className="px-s20">
              <WeddingCountdown targetDate="2026-04-05T10:00:00" />
            </div>
            {/* Calendar Section */}
            <CalendarSection />

            {/* Main Content Area */}
            <main>
              <EventDetails />

              {/* Gallery Section */}
              <Gallery />
              {/* <div
                className="bg-[#111] text-[#ddd] py-s15 px-0 text-center text-xs tracking-[4px] uppercase"
              >
                {"<< Và thế giới đã mất đi 1 người cô đơn >>"}
              </div> */}

              {/* Gifting Section */}
              <Gifting />

              {/* Wish & RSVP Section */}
              <div id="rsvp-section" className="scroll-mt-s20">
                <WishForm scriptUrl={GOOGLE_SCRIPT_URL} />
              </div>

              {/* Thank You Section */}
              <ThankYouSection />

              <footer className="py-s60 px-s24 text-center flex flex-col justify-center items-center">
                <h3 className="text-base  tracking-[2px] font-serif uppercase font-brush m-0 text-primary">
                  THANK YOU FOR WATCHING .<br />I HOPE YOU LIKE IT
                </h3>
              </footer>
            </main>

            <ScrollToTop />
            <FloatingHearts />
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src="/audio/i-do.mp3" loop />
    </div>
  );
}

export default App;
