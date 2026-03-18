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
        className="responsive-flex"
        style={{
          marginTop: "40px",
        }}
      >
        {/* Event 1: Tiệc mừng tại Nhà Gái */}
        <motion.div
          id="event-4"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-50px" }}
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
                Nhà văn Hóa Xóm và - Tư Gia Nhà Gái
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6" }}>
              Tốt động, Chương Mỹ, Hà Nội
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/8Pj5kNwEWBXq3gk29"
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

        {/* Event 2: Lễ cưới chính tại Nhà Trai */}
        <motion.div
          id="event-5"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-50px" }}
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
                Nhà văn Hóa Xóm giữa - Tư Gia Nhà Trai
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6" }}>
              Tốt động, Chương Mỹ, Hà Nội
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/VHEtWz2Urw9GKR3F8"
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
