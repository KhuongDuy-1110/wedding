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
      id: "tiec-nha-gai",
      label: "TIỆC NHÀ GÁI",
      time: "11:00",
      day: "Thứ Sáu",
      date: "05.06",
      year: "2026",
      lunar: "20.04 Âm",
      location: "Thung Lũng Hoa Hồ Tây",
      address: "Ngã 3 P. Nhật Chiêu, Nhật Tân, Tây Hồ, Hà Nội",
      map: "https://maps.app.goo.gl/BXDvzTpXYeNBVcjJ9",
    },
    // {
    //   id: "tiec-mung",
    //   label: "TIỆC MỪNG",
    //   isDynamic: true,
    //   timeBride: "16:00",
    //   dayBride: "Thứ Bảy",
    //   dateBride: "04.04",
    //   lunarBride: "17.02 Âm",
    //   locationBride: "Nhà văn Hóa Xóm và - Tư Gia Nhà Gái",
    //   addressBride: "Tốt động, Chương Mỹ, Hà Nội",
    //   mapBride: "https://maps.app.goo.gl/e6V69PFv2CKDWMbbA",

    //   timeGroom: "16:00",
    //   dayGroom: "Chủ Nhật",
    //   dateGroom: "04.04",
    //   lunarGroom: "17.02 Âm",
    //   locationGroom: "Nhà văn Hóa Xóm giữa - Tư Gia Nhà Trai",
    //   addressGroom: "Tốt động, Chương Mỹ, Hà Nội",
    //   mapGroom: "https://maps.app.goo.gl/6dSmA6fX7HCMgNuY7",
    // },
    {
      id: "tiec-nha-trai",
      label: "TIỆC NHÀ TRAI",
      time: "10:30",
      day: "Thứ Bảy",
      date: "06.06",
      year: "2026",
      lunar: "21.04 Âm",
      location: "Trung Tâm Tiệc Cưới Mai Hồng Phúc",
      address: "1B P. Thiên Lôi, Gia Viên, Hải Phòng",
      map: "https://maps.app.goo.gl/Xhow8f7S2x9fhLz38",
    },
  ];

  return (
    <section id="event-details" className="pb-s50 bg-[#fdfdfd] overflow-hidden">
      <div className="section-title">
        {/* <h2 className="text-[48px] md:text-[48px] font-couple tracking-[2px]" style={{ textTransform: "unset", fontSize: "48px" }}>
          Địa chỉ tham dự
        </h2> */}
        {/* <p className="text-[#999] tracking-[1px] mt-1 text-[13px]">
          Tháng 06 Năm 2026
        </p> */}
      </div>

      <div className="flex flex-col items-center gap-s30 px-s20 mt-s30 max-w-[500px] mx-auto">
        {allEvents.map((event) => {
          // if (event.isDynamic) {
          //   const isBoth = !side || side === "both";
          //   const showBride = isBoth || side === "bride";
          //   const showGroom = isBoth || side === "groom";

          //   return (
          //     <motion.div
          //       key={event.id}
          //       initial={{ opacity: 0, y: 15 }}
          //       whileInView={{ opacity: 1, y: 0 }}
          //       viewport={{ once: true, margin: "-50px" }}
          //       className="design-card py-s25 px-s20 relative text-center w-full border border-primary/10 shadow-md shadow-primary/5 transition-all"
          //     >
          //       <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 py-[4px] px-s20 text-[11px] font-bold tracking-[2px] uppercase rounded-full shadow-md min-w-[110px] bg-primary text-white">
          //         {event.label}
          //       </div>

          //       <div className="space-y-s20 mt-s5">
          //         {showBride && (
          //           <div
          //             className={
          //               showGroom ? "pb-s20 border-b border-gray-100" : ""
          //             }
          //           >
          //             <div className="flex items-center justify-between mb-s15">
          //               <div className="text-left">
          //                 <h4 className="font-brice text-[24px] text-primary leading-none">
          //                   {event.timeBride}
          //                 </h4>
          //                 <p className="text-[#888] text-[12px] font-medium mt-1 uppercase tracking-wider">
          //                   {event.dayBride}
          //                 </p>
          //               </div>
          //               <div className="h-8 w-[1px] bg-gray-200 mx-2" />
          //               <div className="text-right">
          //                 <h4 className="font-brice text-[24px] text-[#333] leading-none">
          //                   {event.dateBride}
          //                 </h4>
          //                 <p className="text-[#888] text-[12px] font-medium mt-1 uppercase tracking-wider">
          //                   {event.lunarBride}
          //                 </p>
          //               </div>
          //             </div>
          //             <div className="flex flex-col items-center gap-1 mb-s15">
          //               <div className="flex flex-wrap items-center justify-center gap-1.5 text-gray-800">
          //                 <MapPin size={15} className="text-primary" />
          //                 <span className="font-bold text-[14px]">
          //                   NHÀ GÁI: {event.locationBride}
          //                 </span>
          //               </div>
          //               <p className="text-[12px] text-gray-500">
          //                 {event.addressBride}
          //               </p>
          //             </div>
          //             <a
          //               href={event.mapBride}
          //               rel="noopener noreferrer"
          //               target="_blank"
          //               className="inline-flex items-center justify-center gap-2 px-s25 py-s8 rounded-full text-[12px] font-bold bg-primary text-white shadow-lg shadow-primary/10 active:scale-95 transition-all w-fit mx-auto"
          //             >
          //               <Navigation size={12} /> CHỈ ĐƯỜNG
          //             </a>
          //           </div>
          //         )}

          //         {showGroom && (
          //           <div className={showBride ? "pt-s10" : ""}>
          //             <div className="flex items-center justify-between mb-s15">
          //               <div className="text-left">
          //                 <h4 className="font-brice text-[24px] text-primary leading-none">
          //                   {event.timeGroom}
          //                 </h4>
          //                 <p className="text-[#888] text-[12px] font-medium mt-1 uppercase tracking-wider">
          //                   {event.dayGroom}
          //                 </p>
          //               </div>
          //               <div className="h-8 w-[1px] bg-gray-200 mx-2" />
          //               <div className="text-right">
          //                 <h4 className="font-brice text-[24px] text-[#333] leading-none">
          //                   {event.dateGroom}
          //                 </h4>
          //                 <p className="text-[#888] text-[12px] font-medium mt-1 uppercase tracking-wider">
          //                   {event.lunarGroom}
          //                 </p>
          //               </div>
          //             </div>
          //             <div className="flex flex-col items-center gap-1 mb-s15">
          //               <div className="flex flex-wrap items-center justify-center gap-1.5 text-gray-800">
          //                 <MapPin size={15} className="text-primary" />
          //                 <span className="font-bold text-[14px]">
          //                   NHÀ TRAI: {event.locationGroom}
          //                 </span>
          //               </div>
          //               <p className="text-[12px] text-gray-500">
          //                 {event.addressGroom}
          //               </p>
          //             </div>
          //             <a
          //               href={event.mapGroom}
          //               rel="noopener noreferrer"
          //               target="_blank"
          //               className="inline-flex items-center justify-center gap-2 px-s25 py-s8 rounded-full text-[12px] font-bold bg-primary text-white shadow-lg shadow-primary/10 active:scale-95 transition-all w-fit mx-auto"
          //             >
          //               <Navigation size={12} /> CHỈ ĐƯỜNG
          //             </a>
          //           </div>
          //         )}
          //       </div>
          //     </motion.div>
          //   );
          // }

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="design-card py-s25 px-s20 relative text-center w-full border border-primary/10 shadow-md shadow-primary/5 transition-all"
            >
              <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 py-[4px] px-s20 text-[11px] font-bold tracking-[2px] uppercase rounded-full shadow-md min-w-[110px] bg-primary text-white">
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
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500">{event.address}</p>
                </div>

                <a
                  href={event.map}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 px-s25 py-s8 rounded-full text-[12px] font-bold bg-primary text-white shadow-lg shadow-primary/10 active:scale-95 transition-all w-fit mx-auto"
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
