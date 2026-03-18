import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WeddingCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const Item = ({ value, label }) => (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        background: "#fff9f9",
        padding: "24px 10px",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          fontSize: "42px",
          fontWeight: "300",
          color: "var(--primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "#888",
          marginTop: "10px",
        }}
      >
        {label === "days"
          ? "Ngày"
          : label === "hours"
            ? "Giờ"
            : label === "minutes"
              ? "Phút"
              : "Giây"}
      </div>
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          margin: "0 auto",
          maxWidth: "480px",
          padding: "0 10px",
          justifyContent: "center",
        }}
      >
        <Item value={timeLeft.days} label="days" />
        <Item value={timeLeft.hours} label="hours" />
        <Item value={timeLeft.minutes} label="minutes" />
        <Item value={timeLeft.seconds} label="seconds" />
      </div>
    </div>
  );
};

export default WeddingCountdown;
