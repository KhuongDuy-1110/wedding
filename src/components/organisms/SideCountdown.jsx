import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SideCountdown = ({ targetDate = "2026-04-05T00:00:00" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isScrolling, setIsScrolling] = useState(false);
  const [isOverCalendar, setIsOverCalendar] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    // Observer for calendar section visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverCalendar(entry.isIntersecting);
      },
      { threshold: 0.2 }, // Hide when 20% of calendar is visible
    );

    const calendarEl = document.getElementById("calendar-section");
    if (calendarEl) observer.observe(calendarEl);

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (calendarEl) observer.unobserve(calendarEl);
    };
  }, []);

  const isHidden = isScrolling || isOverCalendar;

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

  const handleScrollToCalendar = () => {
    const element = document.getElementById("calendar-section");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const items = [
    { label: "ngày", value: timeLeft.days },
    { label: "giờ", value: timeLeft.hours },
    { label: "phút", value: timeLeft.minutes },
    { label: "giây", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{
        x: isHidden ? -100 : 0,
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        opacity: { duration: 0.2 },
      }}
      onClick={handleScrollToCalendar}
      className={`fixed left-0 top-[20%] md:top-1/2 md:-translate-y-1/2 z-[100] flex flex-col gap-1 md:gap-2 cursor-pointer group ${isHidden ? "pointer-events-none" : "pointer-events-auto"}`}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          whileHover={{ x: 10 }}
          className="bg-[#5c1a1a]/90 backdrop-blur-sm px-1.5 py-1.5 md:px-3 md:py-2.5 rounded-r-xl rounded-l-none shadow-lg border-y border-r border-white/10 flex flex-col items-center justify-center min-w-[45px] md:min-w-[65px] group-hover:bg-[#7a2424] transition-colors"
        >
          <div className="text-[12px] md:text-[18px] font-bold text-white leading-none mb-0.5">
            {item.value}
          </div>
          <div className="text-[8px] md:text-[10px] font-medium text-white/70 uppercase tracking-tighter">
            {item.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SideCountdown;
