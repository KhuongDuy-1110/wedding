import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const OpeningEffect = ({
  isOpened,
  onOpen,
  coupleName = "Khương & Giang",
  date = "06.06.2026",
  isReady = true,
  heroImage = "",
  guestName = "",
}) => {
  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="opening-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="fixed top-0 left-0 w-screen h-screen z-[2000] flex overflow-hidden bg-[#4a0404]"
        >
          {/* Shimmer/Glitter Overlay Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1)_1px,transparent_1px),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.15)_1px,transparent_1px),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px,40px_40px,50px_50px] opacity-40 pointer-events-none z-[1]" />

          {/* Left Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="flex-1 h-full bg-gradient-to-br from-[#6b050d] to-[#4a0404] shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-[2] border-r border-white/10"
          />

          {/* Right Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="flex-1 h-full bg-gradient-to-bl from-[#6b050d] to-[#4a0404] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[2] border-l border-white/10"
          />

          {/* Center Content Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-[95%] max-w-[500px] md:max-w-[800px] flex flex-col items-center gap-[25px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", damping: 15 }}
              className="opening-card bg-white p-5 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full flex border border-[#ddd] overflow-hidden"
            >
              {/* Photo Area */}
              <div className="opening-card-image relative">
                {isReady ? (
                  <>
                    <img
                      src={heroImage}
                      alt="Couple"
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Text Overlay on Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end items-center pb-s20 px-s10">
                      <p
                        className="text-[9px] pb-s10 tracking-[5px] m-0 mb-s5 uppercase font-medium"
                        style={{ color: "white" }}
                      >
                        Happy Wedding
                      </p>
                      <h2
                        className="script text-[32px] md:text-[36px] leading-none font-normal flex items-center justify-center w-full gap-s8"
                        style={{ color: "white" }}
                      >
                        <span className="whitespace-nowrap">
                          {coupleName.split(" & ")[0]}
                        </span>
                        <div className="z-[1] shrink-0">
                          <div
                            className="w-s20 h-s20 [mask-image:url(/assets/trai-tim.svg)] [mask-size:contain] [mask-repeat:no-repeat] block"
                            style={{ backgroundColor: "white" }}
                          />
                        </div>
                        <span className="whitespace-nowrap">
                          {coupleName.split(" & ")[1]}
                        </span>
                      </h2>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-100 animate-pulse" />
                )}
              </div>

              {/* Information Area */}
              <div className="opening-card-info">
                <div className="text-[11px] text-[#555] mt-s5 mx-0 mb-0 w-[80%] flex flex-col items-center">
                  <p className="tracking-[1px] uppercase text-[12px] font-brice underline">
                    Save The Date
                  </p>
                  <p className="font-brice font-normal text-[#6b050d] leading-none mt-s5 text-[24px]">
                    06.06.2026
                  </p>
                  <p className="text-[15px] text-[#888] font-medium tracking-[0.5px] mt-2 uppercase">
                    (Âm lịch 21 - 04 Bính Ngọ)
                  </p>
                </div>

                <div className="mt-s15 pt-s15 border-t border-[#eee] w-[80%] text-center">
                  <p className="text-[11px] text-[#999] uppercase tracking-[2px] mb-s5">
                    Trân trọng kính mời
                  </p>
                  <p className="text-[18px] text-[#6b050d] font-semibold tracking-[0.5px] italic font-serif leading-tight">
                    {guestName || ""}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Pulsing Open Button */}
            <div className="text-center">
              {isReady ? (
                <motion.button
                  onClick={onOpen}
                  whileHover={{
                    scale: 1.05,
                    background: "#8a0b16",
                    color: "white",
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 4px 15px rgba(255,255,255,0.2)",
                      "0 4px 25px rgba(255,255,255,0.4)",
                      "0 4px 15px rgba(255,255,255,0.2)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-white text-[#6b050d] border-none py-[10px] px-[40px] rounded-[40px] text-[13px] font-bold tracking-[3px] cursor-pointer transition-all duration-300 ease-in-out uppercase"
                >
                  MỞ THIỆP
                </motion.button>
              ) : (
                <div className="bg-white/20 text-white/80 py-[10px] px-[40px] rounded-[40px] text-[13px] font-bold tracking-[3px] flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ĐANG TẢI...
                </div>
              )}
              <p className="text-white/60 text-[11px] mt-s15 tracking-[1px] italic">
                {isReady
                  ? "Nhấn để xem lời mời"
                  : "Vui lòng đợi trong giây lát"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningEffect;
