import React from "react";
import { motion } from "framer-motion";

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

  return (
    <section
      style={{ padding: "24px 24px", background: "#fff", textAlign: "center" }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "12px",
            letterSpacing: "5px",
            color: "#999",
            marginBottom: "15px",
          }}
        >
          SAVE THE DATE
        </h2>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "'Playfair Display', serif",
            color: "#333",
          }}
        >
          Chủ nhật, Ngày 05 Tháng 04 năm 2026
        </div>
      </div>

      <div
        style={{ maxWidth: "350px", margin: "0 auto", marginBottom: "60px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          {days.map((day) => (
            <div
              key={day}
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#333",
                letterSpacing: "1px",
              }}
            >
              {day}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px",
          }}
        >
          {calendarData.map((day, index) => (
            <div
              key={index}
              style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                fontSize: "14px",
                color: day === weddingDate ? "#fff" : "#333",
                zIndex: 1,
              }}
            >
              {day === weddingDate && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    width: "35px",
                    height: "35px",
                    background: "var(--primary)",
                    borderRadius: "50%",
                    zIndex: -1,
                  }}
                />
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
