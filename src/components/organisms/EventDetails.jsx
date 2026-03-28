import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

/**
 * EventDetails Component
 * Displays wedding event information filtered by side (bride/groom)
 * and uses a more compact vertical layout.
 */
const EventDetails = ({ side }) => {
  const isBride = side === "bride";
  const isGroom = side === "groom";

  const allEvents = [
    {
      id: "an-hoi",
      label: "LỄ ĂN HỎI",
      time: "09:00",
      day: "Thứ Bảy",
      date: "04.04",
      year: "2026",
      lunar: "17.02 Âm",
      location: "Tư Gia Nhà Gái",
      address: "Tốt động, Chương Mỹ, Hà Nội",
      map: "https://maps.app.goo.gl/e6V69PFv2CKDWMbbA",
      sideFlag: "bride",
    },
    {
      id: "tiec-mung",
      label: "TIỆC MỪNG",
      time: isGroom ? "10:00" : "16:00",
      day: isGroom ? "Chủ Nhật" : "Thứ Bảy",
      date: isGroom ? "05.04" : "04.04",
      year: "2026",
      lunar: isGroom ? "18.02 Âm" : "17.02 Âm",
      location: isGroom ? "Nhà văn Hóa Xóm giữa" : "Nhà văn Hóa Xóm và",
      subLocation: isGroom ? "Tư Gia Nhà Trai" : "Tư Gia Nhà Gái",
      address: "Tốt động, Chương Mỹ, Hà Nội",
      map: isGroom
        ? "https://maps.app.goo.gl/6dSmA6fX7HCMgNuY7"
        : "https://maps.app.goo.gl/e6V69PFv2CKDWMbbA",
      sideFlag: isGroom ? "groom" : "bride",
    },
    {
      id: "le-cuoi",
      label: "LỄ CƯỚI CHÍNH",
      time: "10:00",
      day: "Chủ Nhật",
      date: "05.04",
      year: "2026",
      lunar: "18.02 Âm",
      location: "Nhà văn Hóa Xóm giữa",
      subLocation: "Tư Gia Nhà Trai",
      address: "Tốt động, Chương Mỹ, Hà Nội",
      map: "https://maps.app.goo.gl/6dSmA6fX7HCMgNuY7",
      sideFlag: "groom",
    },
  ];

  return (
    <section id="event-details" className="pb-s50 bg-[#fdfdfd] overflow-hidden">
      <div className="section-title pt-s40">
        <h2 className="text-[26px] md:text-[32px] font-brice tracking-[2px]">
          THÔNG TIN HÔN LỄ
        </h2>
        <p className="text-[#999] tracking-[1px] mt-1 text-[13px]">
          Vào Tháng 04 Năm 2026
        </p>
      </div>

      <div className="flex flex-col items-center gap-s30 px-s20 mt-s30 max-w-[500px] mx-auto">
        {allEvents.map((event) => {
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`design-card py-s25 px-s20 relative text-center w-full border border-primary/10 shadow-md shadow-primary/5 transition-all`}
            >
              <div
                className={`absolute -top-[12px] left-1/2 -translate-x-1/2 py-[4px] px-s20 text-[11px] font-bold tracking-[2px] uppercase rounded-full shadow-md min-w-[110px] bg-primary text-white`}
              >
                {event.label}
              </div>

              <div className="flex items-center justify-between mb-s15 mt-s5">
                <div className="text-left">
                  <h4 className="font-brice text-[24px] text-primary leading-none">
                    {event.time}
                  </h4>
                  <p className="text-[#888] text-[12px] font-medium mt-1 uppercase tracking-wider">
                    {event.day}
                  </p>
                </div>
                <div className="h-8 w-[1px] bg-gray-200 mx-2" />
                <div className="text-right">
                  <h4 className="font-brice text-[24px] text-[#333] leading-none">
                    {event.date}
                  </h4>
                  <p className="text-[#888] text-[12px] font-medium mt-1 uppercase tracking-wider">
                    {event.lunar}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-s15">
                <div className="flex flex-col items-center gap-1 mb-s15">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-gray-800">
                    <MapPin size={15} className="text-primary" />
                    <span className="font-bold text-[14px]">
                      {event.location}
                      {event.subLocation ? ` - ${event.subLocation}` : ""}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500">{event.address}</p>
                </div>

                <a
                  href={event.map}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={`inline-flex items-center justify-center gap-2 px-s25 py-s8 rounded-full text-[12px] font-bold transition-all w-fit mx-auto shadow-lg active:scale-95 bg-primary text-white shadow-primary/10 hover:opacity-90`}
                >
                  <Navigation size={12} /> CHỈ ĐƯỜNG
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EventDetails;
