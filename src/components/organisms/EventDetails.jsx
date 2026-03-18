import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

const EventDetails = () => {
  return (
    <section className="section-padding" style={{ background: "#fdfdfd" }}>
      <div className="section-title">
        <h2>THÔNG TIN HÔN LỄ</h2>
        <p>Vào tháng 04 năm 2026</p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          marginTop: "40px",
        }}
      >
        {/* Event 1: Tiệc mừng */}
        <motion.div
          id="event-4"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="design-card"
          style={{
            padding: "40px 20px",
            position: "relative",
            textAlign: "center",
            overflow: "visible",
            scrollMarginTop: "50px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--primary)",
              color: "white",
              padding: "6px 24px",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            LỄ ĂN HỎI & TIỆC MỪNG
          </div>

          <h3
            className="font-brice"
            style={{
              fontSize: "22px",
              margin: "20px 0 10px",
              color: "var(--primary)",
              letterSpacing: "1px",
            }}
          >
            Thứ Bảy - 04 Tháng 04
          </h3>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
            Tức Ngày 18 Tháng 02 Năm Ất Tỵ (Âm Lịch)
          </p>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <MapPin size={18} color="var(--primary)" />
              <span style={{ fontWeight: "700", fontSize: "15px" }}>
                Tạ Gia - Tư Gia Nhà Gái
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6" }}>
              Xóm 8 - Nghĩa Lợi - Nghĩa Hưng - Nam Định
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/YourMapLink1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              textDecoration: "none",
              maxWidth: "200px",
              margin: "0 auto",
              padding: "12px",
            }}
          >
            <Navigation size={16} style={{ marginRight: "10px" }} /> CHỈ ĐƯỜNG
          </a>
        </motion.div>

        {/* Event 2: Lễ cưới chính */}
        <motion.div
          id="event-5"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="design-card"
          style={{
            padding: "40px 20px",
            position: "relative",
            textAlign: "center",
            overflow: "visible",
            scrollMarginTop: "100px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--primary)",
              color: "white",
              padding: "6px 24px",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            LỄ CƯỚI CHÍNH
          </div>

          <h3
            className="font-brice"
            style={{
              fontSize: "22px",
              margin: "20px 0 10px",
              color: "var(--primary)",
              letterSpacing: "1px",
            }}
          >
            Chủ Nhật - 05 Tháng 04
          </h3>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
            Tức Ngày 17 Tháng 02 Năm Ất Tỵ (Âm Lịch)
          </p>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <MapPin size={18} color="var(--primary)" />
              <span style={{ fontWeight: "700", fontSize: "15px" }}>
                Tư Gia Nhà Trai
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6" }}>
              Xóm 7 - Nghĩa Lợi - Nghĩa Hưng - Nam Định
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/YourMapLink2"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              textDecoration: "none",
              maxWidth: "200px",
              margin: "0 auto",
              padding: "12px",
            }}
          >
            <Navigation size={16} style={{ marginRight: "10px" }} /> CHỈ ĐƯỜNG
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
