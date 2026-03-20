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
    <div className="flex-1 text-center bg-[#fff9f9] py-s24 px-s10 rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
      <div className="text-[42px] font-light text-primary leading-none">
        {value}
      </div>
      <div className="text-[12px] uppercase tracking-[2px] text-[#888] mt-s10">
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
    <div className="py-s20 px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        className="text-center mb-s40"
      >
        <h2 className="font-serif text-[32px] text-[#222] font-normal tracking-[3px] mb-s15">
          INVITATION
        </h2>
        <p className="font-sans text-[13px] text-[#444] tracking-[1px] uppercase font-medium">
          Đến dự đám cưới của chúng mình
        </p>
      </motion.div>

      <div className="flex gap-s12 mx-auto max-w-[480px] px-s10 justify-center">
        <Item value={timeLeft.days} label="days" />
        <Item value={timeLeft.hours} label="hours" />
        <Item value={timeLeft.minutes} label="minutes" />
        <Item value={timeLeft.seconds} label="seconds" />
      </div>
    </div>
  );
};

export default WeddingCountdown;
