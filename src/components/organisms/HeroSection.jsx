import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PhotoFrame from "../molecules/PhotoFrame";

const HeroSection = ({ date, coupleName, timeLabel }) => {
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) {
      setGuestName(name);
    }
  }, []);

  return (
    <section
      className="hero-section text-center p-5 bg-bg-light border-b-4 border-accent relative min-h-[100svh] flex flex-col items-center justify-center"
    >
      {/* Decorative Traditional  Border Patterns (Greek Key) */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent via-transparent to-accent opacity-50" />

      <PhotoFrame
        src="/assets/couple.png"
        alt="Handsome Groom and Beautiful Bride"
        className="hero-photo"
      />

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="tracking-[5px] text-[14px] mb-s10 text-[#666] mt-s15"
      >
        WEDDING INVITATION
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="font-brush text-[44px] text-primary my-s15 mx-0 leading-none font-normal flex items-center justify-center w-full gap-s15"
      >
        <span className="whitespace-nowrap">
          {coupleName.split(" & ")[0]}
        </span>
        <div className="z-[1] shrink-0">
          <div className="w-[35px] h-[35px] bg-primary [mask-image:url(/assets/trai-tim.svg)] [mask-size:contain] [mask-repeat:no-repeat] block" />
        </div>
        <span className="whitespace-nowrap">
          {coupleName.split(" & ")[1]}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-[1.2rem] font-bold uppercase"
      >
        {timeLabel}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="font-brice text-[3rem] font-bold text-primary tracking-[2px]"
      >
        {date}
      </motion.p>

      {guestName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-s30 inline-block w-[80%] max-w-[350px]"
        >
          <p className="text-[12px] text-[#666] mb-s15 tracking-[2px] uppercase">
            TRÂN TRỌNG KÍNH MỜI
          </p>
          <h3 className="font-brice text-[28px] text-primary capitalize">
            {guestName}
          </h3>
          <p className="text-[13px] text-[#666] mt-s15 italic leading-[1.5]">
            Đến chung vui cùng gia đình chúng tôi
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;
