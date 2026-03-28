import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, QrCode } from "lucide-react";

const SideCountdown = ({
  targetDate = "2026-04-05T00:00:00",
  side = "both",
  onOpenMap,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isScrolling, setIsScrolling] = useState(false);
  const [isOverCalendar, setIsOverCalendar] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const skipHideRef = useRef(false);

  useEffect(() => {
    // Observer for calendar section visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverCalendar(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    const calendarEl = document.getElementById("calendar-section");
    if (calendarEl) observer.observe(calendarEl);

    const handleScroll = () => {
      // Check both local ref and global session storage for auto-scroll indicator
      if (
        skipHideRef.current || 
        sessionStorage.getItem("is_auto_scrolling") === "true" ||
        sessionStorage.getItem("auto_flip_gifting") === "true"
      ) return;
      
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

  const [autoScrolling, setAutoScrolling] = useState(false);

  useEffect(() => {
    const checkFlag = () => {
      const isAuto = 
        sessionStorage.getItem("is_auto_scrolling") === "true" ||
        sessionStorage.getItem("auto_flip_gifting") === "true";
      if (isAuto !== autoScrolling) setAutoScrolling(isAuto);
    };

    const interval = setInterval(checkFlag, 200);
    return () => clearInterval(interval);
  }, [autoScrolling]);

  const isHidden = (isScrolling || isOverCalendar) && !autoScrolling;

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

  const handleAutoScroll = (targetId, isCalendar = false) => {
    const element = document.getElementById(targetId);
    if (element) {
      if (!isCalendar) {
        skipHideRef.current = true;
        sessionStorage.setItem("is_auto_scrolling", "true");
        setIsScrolling(false);
      }
      
      const offset = isCalendar ? 80 : (window.innerHeight - element.offsetHeight) / 2;
      const top = element.getBoundingClientRect().top + window.pageYOffset - (offset > 0 ? offset : 0);

      window.scrollTo({ top, behavior: "smooth" });
      
      if (!isCalendar) {
        setTimeout(() => {
          skipHideRef.current = false;
          sessionStorage.removeItem("is_auto_scrolling");
        }, 1500);
      }
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
      className={`fixed !left-0 !right-auto top-[20%] md:top-[25%] md:-translate-y-1/2 z-[100] flex flex-col gap-1 md:gap-2 ${
        isHidden ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      <div className="flex flex-col gap-1 md:gap-2">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            onClick={() => handleAutoScroll("calendar-section", true)}
            className="bg-[#5c1a1a]/90 backdrop-blur-sm px-1.5 py-1.5 md:px-3 md:py-2.5 rounded-r-xl shadow-lg border-y border-r border-white/10 flex flex-col items-center justify-center min-w-[45px] md:min-w-[65px] hover:bg-[#7a2424] transition-colors cursor-pointer"
          >
            <div className="text-[12px] md:text-[18px] font-bold text-white leading-none mb-0.5">
              {item.value}
            </div>
            <div className="text-[8px] md:text-[10px] font-medium text-white/70 uppercase tracking-tighter">
              {item.label}
            </div>
          </motion.div>
        ))}

        <motion.div
          onClick={(e) => {
            e.stopPropagation();
            onOpenMap();
          }}
          className="bg-[#c43838] px-1.5 py-1.5 md:px-3 md:py-2.5 rounded-r-xl shadow-lg border-y border-r border-white/20 flex flex-col items-center justify-center min-w-[45px] md:min-w-[65px] hover:bg-[#d44848] transition-colors cursor-pointer shine-effect"
        >
          <MapPin size={18} className="text-white" />
          <div className="text-[8px] md:text-[9px] font-bold text-white uppercase mt-0.5">
            Bản đồ
          </div>
        </motion.div>

        <motion.div
          onClick={(e) => {
            e.stopPropagation();
            sessionStorage.setItem("auto_flip_gifting", "true");
            handleAutoScroll("gifting-section");
          }}
          className="bg-[#E7B547] px-1.5 py-1.5 md:px-3 md:py-2.5 rounded-r-xl shadow-lg border-y border-r border-white/20 flex flex-col items-center justify-center min-w-[45px] md:min-w-[65px] hover:opacity-90 transition-opacity cursor-pointer shadow-amber-500/20 shine-effect"
        >
          <QrCode size={18} className="text-black" />
          <div className="text-[8px] md:text-[9px] font-bold text-black uppercase mt-0.5">
            Gửi quà
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SideCountdown;
