import React, { useState, useEffect } from "react";
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

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

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
      className="max-width-container"
      style={{
        position: "relative",
        overflow: isOpened ? "auto" : "hidden",
        height: isOpened ? "auto" : "100vh",
      }}
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
        className="glass"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 100,
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          border: "none",
          opacity: isOpened ? 1 : 0,
          pointerEvents: isOpened ? "auto" : "none",
        }}
      >
        <Music
          size={20}
          color={isPlaying ? "var(--primary)" : "var(--text-muted)"}
          style={{ animation: isPlaying ? "spin 3s linear infinite" : "none" }}
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

            {/* Quote Section */}
            <QuoteSection />

            {/* Profile Section */}
            <ProfileSection />

            {/* Countdown Section */}
            <div style={{ padding: "0 20px" }}>
              <WeddingCountdown targetDate="2026-04-05T10:00:00" />
            </div>
            {/* Calendar Section */}
            <CalendarSection />

            {/* Main Content Area */}
            <main>
              <EventDetails />

              {/* Gallery Section */}
              <Gallery />

              {/* Gifting Section */}
              <Gifting />

              {/* Wish & RSVP Section */}
              <div id="rsvp-section">
                <WishForm scriptUrl={GOOGLE_SCRIPT_URL} />
              </div>

              {/* Closing Section */}
              <section
                style={{
                  padding: "60px 24px",
                  textAlign: "center",
                  background: "var(--bg-light)",
                }}
              >
                <Heart
                  size={40}
                  color="var(--primary)"
                  fill="var(--primary)"
                  opacity="0.1"
                  style={{ marginBottom: "20px" }}
                />
                <h2
                  className="script"
                  style={{ fontSize: "32px", marginBottom: "10px" }}
                >
                  Trân Trọng Kính Mời
                </h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    marginBottom: "30px",
                    maxWidth: "300px",
                    margin: "0 auto 30px",
                  }}
                >
                  Sự diện diện của bạn là món quà tuyệt vời nhất dành cho chúng
                  tôi trong ngày khởi đầu hành trình mới này.
                </p>

                <button
                  className="btn-primary"
                  onClick={handleCelebrate}
                  style={{
                    padding: "16px 32px",
                    fontSize: "16px",
                    margin: "0 auto",
                  }}
                >
                  <MessageSquareText size={20} />
                  KỶ NIỆM CÙNG CHÚNG TÔI
                </button>
              </section>

              <footer
                style={{
                  padding: "40px 24px",
                  textAlign: "center",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "var(--text-muted)",
                  opacity: 0.6,
                }}
              >
                © 2025 THIỆP CƯỚI ONLINE - DESIGN BY ANTIGRAVITY
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
