import React from "react";
import { motion } from "framer-motion";

const PhotoFrame = ({ src, alt, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`photo-frame ${className} relative p-3 bg-white border-[1.5px] border-accent rounded-[4px] overflow-visible max-w-[90%] w-fit mx-auto shadow-[0_20px_40px_rgba(0,0,0,0.1)]`}
    >
      {/* Decorative Gold Inner Border */}
      <div className="absolute inset-1 border border-accent/40 z-[1] pointer-events-none" />

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        className="w-auto max-w-full max-h-[35vh] md:max-h-[40vh] block rounded-[2px] relative z-0 object-contain"
      />


      {/* Decorative Traditional Corners */}
      <div className="absolute -bottom-[15px] -right-[15px] text-[24px] text-accent -rotate-45">
        💠
      </div>
    </motion.div>
  );
};

export default PhotoFrame;
