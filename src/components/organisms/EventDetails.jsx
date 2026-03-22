import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

const EventDetails = ({ side }) => {
  const isBride = side === "bride";
  const isGroom = side === "groom";

  return (
    <section className="pb-s20 bg-[#fdfdfd]">
      <div className="section-title">
        <h2>THÔNG TIN HÔN LỄ</h2>
        <p>Vào tháng 04 năm 2026</p>
      </div>

      <div
        className={`flex flex-col md:flex-row gap-s30 px-s20 mt-s40 ${isBride ? "md:flex-row-reverse" : ""}`}
      >
        {/* Event 1: Tiệc mừng tại Nhà Gái */}
        <motion.div
          id="event-4"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className={`design-card py-s40 px-s20 relative text-center overflow-visible scroll-mt-s50 flex-1 ${isBride ? "border-2 border-primary shadow-lg" : ""}`}
        >
          <div className="absolute -top-[15px] left-1/2 -translate-x-1/2 bg-primary text-white py-[6px] px-s12 text-[12px] font-bold tracking-[2px] uppercase">
            LỄ ĂN HỎI & TIỆC MỪNG
          </div>

          <h3 className="font-brice text-[22px] mt-s20 mx-0 mb-s10 text-primary tracking-[1px]">
            Thứ Bảy - 16:00 - 04 Tháng 04
          </h3>
          <p className="text-[#666] text-[14px] mb-s20">
            Tức Ngày 17 Tháng 02 Năm Bính Ngọ (Âm Lịch)
          </p>

          <div className="border-t border-[#eee] pt-s20 mb-s20">
            <div className="flex items-center justify-center gap-s8 mb-s10">
              <MapPin size={18} color="var(--color-primary)" />
              <span className="font-bold text-[15px]">
                Nhà văn Hóa Xóm và - Tư Gia Nhà Gái
              </span>
            </div>
            <p className="text-[13px] text-[#888] leading-[1.6]">
              Tốt động, Chương Mỹ, Hà Nội
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/8Pj5kNwEWBXq3gk29"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary no-underline max-w-[200px] mx-auto p-3"
          >
            <Navigation size={16} className="mr-s10" /> CHỈ ĐƯỜNG
          </a>
        </motion.div>

        {/* Event 2: Lễ cưới chính tại Nhà Trai */}
        <motion.div
          id="event-5"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className={`design-card py-s40 px-s20 relative text-center overflow-visible scroll-mt-s100 flex-1 ${isGroom ? "border-2 border-primary shadow-lg" : ""}`}
        >
          <div className="absolute -top-[15px] left-1/2 -translate-x-1/2 bg-primary text-white py-[6px] px-s24 text-[12px] font-bold tracking-[2px] uppercase">
            LỄ CƯỚI CHÍNH
          </div>

          <h3 className="font-brice text-[22px] mt-s20 mx-0 mb-s10 text-primary tracking-[1px]">
            Chủ Nhật - 10:00 - 05 Tháng 04
          </h3>
          <p className="text-[#666] text-[14px] mb-s20">
            Tức Ngày 18 Tháng 02 Năm Bính Ngọ (Âm Lịch)
          </p>

          <div className="border-t border-[#eee] pt-s20 mb-s20">
            <div className="flex items-center justify-center gap-s8 mb-s10">
              <MapPin size={18} color="var(--color-primary)" />
              <span className="font-bold text-[15px]">
                Nhà văn Hóa Xóm giữa - Tư Gia Nhà Trai
              </span>
            </div>
            <p className="text-[13px] text-[#888] leading-[1.6]">
              Tốt động, Chương Mỹ, Hà Nội
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/VHEtWz2Urw9GKR3F8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary no-underline max-w-[200px] mx-auto p-3"
          >
            <Navigation size={16} className="mr-s10" /> CHỈ ĐƯỜNG
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
