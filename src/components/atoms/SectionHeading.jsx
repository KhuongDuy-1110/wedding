import React from "react";
import { motion } from "framer-motion";

const SectionHeading = ({ children, subtitle }) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      {subtitle && (
        <p
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "var(--text-muted)",
            marginBottom: "5px",
          }}
        >
          {subtitle}
        </p>
      )}
      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="script"
        style={{ fontSize: "32px", color: "var(--primary)" }}
      >
        {children}
      </motion.h2>
      <div className="divider" />
    </div>
  );
};

export default SectionHeading;
