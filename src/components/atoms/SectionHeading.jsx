import React from "react";
import { motion } from "framer-motion";

const SectionHeading = ({ children, subtitle }) => {
  return (
    <div className="text-center mb-s30">
      {subtitle && (
        <p className="text-[12px] uppercase tracking-[3px] text-text-muted mb-s5">
          {subtitle}
        </p>
      )}

      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-50px" }}
        className="script text-[32px] text-primary"
      >
        {children}
      </motion.h2>
      <div className="divider" />
    </div>
  );
};

export default SectionHeading;
