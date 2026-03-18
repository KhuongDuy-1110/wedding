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
import ThankYouSection from "./components/organisms/ThankYouSection";

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

            {/* Profile Section */}
            <ProfileSection />

            {/* Quote Section */}
            <QuoteSection />

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
              {/* <div
                style={{
                  background: "#111",
                  color: "#ddd",
                  padding: "15px 0",
                  textAlign: "center",
                  fontSize: "12px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                }}
              >
                {"<< Và thế giới đã mất đi 1 người cô đơn >>"}
              </div> */}

              {/* Gifting Section */}
              <Gifting />

              {/* Wish & RSVP Section */}
              <div id="rsvp-section">
                <WishForm scriptUrl={GOOGLE_SCRIPT_URL} />
              </div>

              {/* Thank You Section */}
              <ThankYouSection />

              <footer
                style={{
                  padding: "60px 24px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    letterSpacing: "2px",
                    fontFamily: "'Playfair Display', serif",
                    textTransform: "uppercase",
                    fontWeight: "normal",
                    margin: 0,
                  }}
                >
                  THANK YOU FOR WATCHING . I HOPE YOU LIKE IT
                </h3>
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
