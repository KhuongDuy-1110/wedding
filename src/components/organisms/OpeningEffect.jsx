import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const OpeningEffect = ({
  isOpened,
  onOpen,
  coupleName = "Hùng & Thúy",
  date = "08.12.2024",
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-[95%] max-w-[800px] flex flex-col items-center gap-[25px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", damping: 15 }}
              className="opening-card bg-white p-5 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full flex border border-[#ddd] overflow-hidden"
            >
              {/* Photo Area */}
              <div className="opening-card-image">
                <img
                  src="https://thieucuoi-demo.vercel.app/images/opening.jpg"
                  alt="Couple"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Information Area */}
              <div className="opening-card-info">
                <p className="text-[12px] tracking-[4px] text-[#999] m-0 mb-s10 uppercase">
                  Happy Wedding
                </p>

                <h2 className="script my-s15 mx-0 text-[38px] text-[#6b050d] leading-none font-normal flex items-center justify-center w-full gap-s10">
                  <span className="whitespace-nowrap">
                    {coupleName.split(" & ")[0]}
                  </span>
                  <div className="z-[1] shrink-0">
                    <div className="w-s25 h-s25 bg-[#6b050d] [mask-image:url(/assets/trai-tim.svg)] [mask-size:contain] [mask-repeat:no-repeat] block" />
                  </div>
                  <span className="whitespace-nowrap">
                    {coupleName.split(" & ")[1]}
                  </span>
                </h2>

                <div className="text-[11px] text-[#555] border-t border-[#eee] mt-s10 mx-0 mb-0 w-[80%] pt-s10">
                  <p className="tracking-[1px] uppercase text-[10px] mb-s5">
                    Save The Date
                  </p>
                  <p className="font-brice font-normal text-[#6b050d] mt-s5 text-[24px]">
                    {date}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Pulsing Open Button */}
            <div className="text-center">
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
                className="bg-white text-[#6b050d] border-none py-[14px] px-[50px] rounded-[40px] text-[15px] font-bold tracking-[5px] cursor-pointer transition-all duration-300 ease-in-out uppercase"
              >
                MỞ THIỆP
              </motion.button>
              <p className="text-white/60 text-[11px] mt-s15 tracking-[1px] italic">
                Nhấn để xem lời mời
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningEffect;
