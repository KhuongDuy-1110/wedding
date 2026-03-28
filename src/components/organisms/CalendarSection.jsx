import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const CalendarSection = () => {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const calendarData = [
    null,
    null,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];
  const weddingDate = 5;
  const engagementDate = 4;
  const handleDateClick = (day) => {
    if (day === engagementDate || day === weddingDate) {
      sessionStorage.setItem("is_auto_scrolling", "true");
      document
        .getElementById(`event-${day}`)
        ?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        sessionStorage.removeItem("is_auto_scrolling");
      }, 1500);
    }
  };

  return (
    <section id="calendar-section" className="py-s24 px-s24 bg-white text-center">
      <div className="mb-s40">
        <div className="text-[20px] font-serif text-[#333]">
          Chủ nhật, Ngày 05 Tháng 04 năm 2026
        </div>
      </div>

      <div className="max-w-[350px] mx-auto mb-s60">
        <div className="grid grid-cols-7 gap-s10 mb-s10">
          {days.map((day) => (
            <div
              key={day}
              className="text-[10px] font-bold text-[#333] tracking-[1px]"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-s10">
          {calendarData.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`h-[40px] flex items-center justify-center relative text-sm z-[1] ${
              day === weddingDate || day === engagementDate ? "text-primary font-bold" : "text-[#333]"
              } ${
                day === engagementDate || day === weddingDate
                  ? "cursor-pointer"
                  : "cursor-default"
              }`}
            >
              {day === weddingDate && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center -z-[1]"
                >
                  <Heart size={38} strokeWidth={2} className="text-primary" fill="none" />
                </motion.div>
              )}
              {day === engagementDate && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center -z-[1]"
                >
                   <Heart size={38} strokeWidth={2} className="text-primary/40" fill="none" />
                </motion.div>
              )}
              {day}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
