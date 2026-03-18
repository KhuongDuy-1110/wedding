import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DoubleHappiness from "../atoms/DoubleHappiness";

const OpeningEffect = ({
  isOpened,
  onOpen,
  coupleName = "Hùng & Thúy",
  date = "08.12.2024",
}) => {
  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="opening-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2000,
            display: "flex",
            overflow: "hidden",
            background: "#4a0404", // Darker base
          }}
        >
          {/* Shimmer/Glitter Overlay Texture */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px, 40px 40px, 50px 50px",
              opacity: 0.4,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Left Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            style={{
              flex: 1,
              height: "100%",
              background: "linear-gradient(135deg, #6b050d 0%, #4a0404 100%)",
              boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
              zIndex: 2,
              borderRight: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          {/* Right Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            style={{
              flex: 1,
              height: "100%",
              background: "linear-gradient(-135deg, #6b050d 0%, #4a0404 100%)",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
              zIndex: 2,
              borderLeft: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          {/* Center Content Card */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              width: "92%",
              maxWidth: "480px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "25px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", damping: 15 }}
              className="opening-card"
              style={{
                background: "white",
                padding: "12px",
                borderRadius: "2px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                width: "100%",
                display: "flex",
                border: "1px solid #ddd",
                overflow: "hidden",
              }}
            >
              {/* Photo Area */}
              <div className="opening-card-image">
                <img
                  src="https://thieucuoi-demo.vercel.app/images/opening.jpg"
                  alt="Couple"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Information Area */}
              <div className="opening-card-info">
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "3px",
                    color: "#999",
                    margin: "0 0 5px 0",
                    textTransform: "uppercase",
                  }}
                >
                  Happy Wedding
                </p>

                <h2
                  className="script"
                  style={{
                    margin: "10px 0",
                    fontSize: "32px",
                    color: "#6b050d",
                    lineHeight: 1,
                    fontWeight: "normal",
                  }}
                >
                  {coupleName}
                </h2>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    borderTop: "1px solid #eee",
                    margin: "10px 0 0 0",
                    paddingTop: "10px",
                    width: "80%",
                  }}
                >
                  <p
                    style={{
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      fontSize: "10px",
                    }}
                  >
                    Save The Date
                  </p>
                  <p
                    className="font-brice"
                    style={{
                      fontWeight: "normal",
                      color: "#6b050d",
                      marginTop: "8px",
                      fontSize: "18px",
                    }}
                  >
                    {date}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Pulsing Open Button */}
            <div style={{ textAlign: "center" }}>
              <motion.button
                onClick={onOpen}
                whileHover={{
                  scale: 1.05,
                  background: "#8a0b16",
                  color: "white",
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 4px 15px rgba(255,255,255,0.2)",
                    "0 4px 25px rgba(255,255,255,0.4)",
                    "0 4px 15px rgba(255,255,255,0.2)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  background: "white",
                  color: "#6b050d",
                  border: "none",
                  padding: "14px 50px",
                  borderRadius: "40px",
                  fontSize: "15px",
                  fontWeight: "700",
                  letterSpacing: "5px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                }}
              >
                MỞ THƯ
              </motion.button>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "11px",
                  marginTop: "15px",
                  letterSpacing: "1px",
                  fontStyle: "italic",
                }}
              >
                Nhấn để xem lời mời
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningEffect;
