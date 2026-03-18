import React from "react";
import { motion } from "framer-motion";

const PhotoFrame = ({ src, alt, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className={`photo-frame ${className}`}
      style={{
        position: "relative",
        padding: "12px",
        background: "white",
        border: "1.5px solid var(--accent)",
        borderRadius: "4px",
        overflow: "visible",
        maxWidth: "90%",
        margin: "20px auto",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}
    >
      {/* Decorative Gold Inner Border */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          bottom: "4px",
          left: "4px",
          right: "4px",
          border: "1px solid rgba(231, 181, 71, 0.4)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          display: "block",
          borderRadius: "2px",
          position: "relative",
          zIndex: 0,
        }}
      />

      {/* Decorative Traditional Corners */}
      <div
        style={{
          position: "absolute",
          bottom: "-15px",
          right: "-15px",
          fontSize: "24px",
          color: "var(--accent)",
          transform: "rotate(-45deg)",
        }}
      >
        💠
      </div>
    </motion.div>
  );
};

export default PhotoFrame;
