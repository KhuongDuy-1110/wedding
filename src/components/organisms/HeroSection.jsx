import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DoubleHappiness from "../atoms/DoubleHappiness";
import PhotoFrame from "../molecules/PhotoFrame";

const HeroSection = ({ date, coupleName }) => {
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) {
      setGuestName(name);
    }
  }, []);

  return (
    <section
      className="hero-section"
      style={{
        textAlign: "center",
        padding: "40px 0",
        background: "var(--bg-light)",
        borderBottom: "4px solid var(--accent)",
        position: "relative",
      }}
    >
      {/* Decorative Traditional Border Patterns (Greek Key) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          backgroundImage:
            "linear-gradient(90deg, var(--accent) 0%, transparent 50%, var(--accent) 100%)",
          opacity: 0.5,
        }}
      />

      <PhotoFrame
        src="/assets/couple.png"
        alt="Handsome Groom and Beautiful Bride"
        className="hero-photo"
      />

      {/* Monogram / Header Style */}
      {/* <div style={{ padding: "20px 0", margin: "20px 0 10px" }}>
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "3px",
            color: "#999",
            marginBottom: "10px",
          }}
        >
          SAVE THE DATE
        </div>
        <div
          className="font-brice"
          style={{
            fontSize: "28px",
            display: "inline-block",
            borderBottom: "1px solid #333",
            paddingBottom: "10px",
            color: "#333",
          }}
        >
          K / N
        </div>
      </div> */}

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          letterSpacing: "5px",
          fontSize: "14px",
          marginBottom: "10px",
          color: "#666",
        }}
      >
        WEDDING INVITATION
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="font-brush"
        style={{
          fontSize: "48px",
          margin: "10px 0",
          wordBreak: "keep-all",
          lineHeight: "1.3",
          fontWeight: "normal",
        }}
      >
        {coupleName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{ fontSize: "1.2rem", fontWeight: "bold" }}
      >
        THỨ 5 - 10H00
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="font-brice"
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "var(--primary)",
          letterSpacing: "2px",
          marginTop: "10px",
        }}
      >
        {date}
      </motion.p>

      {guestName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            marginTop: "30px",
            display: "inline-block",
            width: "80%",
            maxWidth: "350px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "15px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            TRÂN TRỌNG KÍNH MỜI
          </p>
          <h3
            className="font-brice"
            style={{
              fontSize: "28px",
              color: "var(--primary)",
              textTransform: "capitalize",
            }}
          >
            {guestName}
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              marginTop: "15px",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            Đến chung vui cùng gia đình chúng tôi
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;
