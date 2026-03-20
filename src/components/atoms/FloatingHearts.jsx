import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart as HeartIcon } from "lucide-react";

/**
 * Pre-calculate fixed keyframes for each heart to avoid "jumps" during re-renders.
 */
const Heart = ({ delay, x, size, duration, swayX, swayRot }) => {
  return (
    <motion.div
      initial={{ y: "-10vh", opacity: 0, x: `${x}vw`, rotate: swayRot[0] }}
      animate={{ 
        y: "110vh", 
        opacity: [0, 0.6, 0.6, 0],
        rotate: swayRot,
        x: swayX.map(dx => `${x + dx}vw`)
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear" 
      }}
      className="fixed pointer-events-none z-[200]"
    >
      <HeartIcon 
        size={size} 
        fill="currentColor" 
        className="text-primary drop-shadow-sm opacity-60" 
      />
    </motion.div>
  );
};

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const count = 12;
    const newHearts = Array.from({ length: count }).map((_, i) => {
      const baseX = Math.random() * 100;
      return {
        id: i,
        // Negative delay makes them start at different positions immediately
        delay: Math.random() * -30, 
        x: baseX,
        size: Math.random() * 8 + 10,
        duration: Math.random() * 15 + 15,
        // Pre-generate swaying path
        swayX: [0, Math.random() * 15 - 7, Math.random() * 15 - 7, Math.random() * 15 - 7, 0],
        swayRot: [0, Math.random() * 90 - 45, Math.random() * 180 - 90, Math.random() * 90 - 45, 0]
      };
    });
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[200]">
      {hearts.map((h) => (
        <Heart key={h.id} {...h} />
      ))}
    </div>
  );
};

export default FloatingHearts;
