import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PhotoFrame from "../molecules/PhotoFrame";
import { useSiteSettings } from "../../hooks/use-site-settings";

const HeroSection = ({ date, coupleName, timeLabel, guestName }) => {
  const { data: settings } = useSiteSettings();
  const [weddingDate, setWeddingDate] = useState("THỨ BẢY • 06.06.2026");

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const targetSection = pathSegments[1]; 
    
    if (targetSection === 'g') {
      setWeddingDate("THỨ SÁU • 05.06.2026");
    }
  }, []);

  return (
    <section className="hero-section relative w-full flex flex-col bg-white min-h-[100svh]">
      {/* Top Photo Part with Torn Edge */}
      <div
        className={`relative w-full h-[70svh] overflow-hidden transition-all duration-700`}
      >
        <img
          src={settings?.hero_couple || ""}
          alt="Hero Couple"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0"></div>

        {/* SAVE the DATE Overlay */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute bottom-[40px] left-[5%] md:left-[8%] flex flex-col items-start z-10"
        >
          <span className="font-serif text-[40px] md:text-[55px] text-white leading-[0.85] tracking-[3px] drop-shadow-md">
            SAVE
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-couple italic text-[30px] md:text-[45px] text-white lowercase drop-shadow-md leading-[0.85]">
              the
            </span>
            <span className="font-serif text-[40px] md:text-[55px] text-white leading-[0.85] tracking-[3px] drop-shadow-md">
              DATE
            </span>
          </div>
        </motion.div>

        {/* Torn Edge Separator */}
        <div className="absolute bottom-[-90px] h-s200 left-0 w-full z-20 pointer-events-none">
          <img
            src="/assets/net-dut.webp"
            alt="Torn Edge"
            className="w-full h-[200px] object-cover block"
            style={{ filter: "drop-shadow(rgba(0, 0, 0, 0.15) 0px -4px 8px)" }}
          />
        </div>
      </div>

      {/* Content Part Below */}
      <div
        className="flex-1 flex flex-col items-center justify-start pt-s15 pb-s40 px-s20 relative z-20 bg-white"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, white 0%, white 40px, transparent 100%), url('/assets/background.webp')",
          backgroundSize: "140%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="tracking-[4px] text-[12px] md:text-[14px] text-text-muted mb-s5"
        >
          WEDDING INVITATION
        </motion.p> */}

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-brush text-[36px] md:text-[50px] text-primary my-s10 leading-tight flex items-center justify-center w-full gap-s10"
        >
          <span className="whitespace-nowrap font-bold">
            {coupleName.split(" & ")[0]}
          </span>
          <div className="z-[1] shrink-0">
            <div className="w-[30px] h-[30px] bg-primary [mask-image:url(/assets/trai-tim.svg)] [mask-size:contain] [mask-repeat:no-repeat]" />
          </div>
          <span className="whitespace-nowrap font-bold">
            {coupleName.split(" & ")[1]}
          </span>
        </motion.h1>

        <p className="text-primary font-bold tracking-[1.5px] mt-2 text-[13px] md:text-[14px] uppercase text-center whitespace-nowrap">
          {weddingDate}
        </p>

        <div className="mt-s20 text-center">
          {/* <p className="text-[18px] text-text-muted mb-s5 tracking-[2px] uppercase">
            TRÂN TRỌNG KÍNH MỜI
          </p> */}
          {guestName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h3 className="font-brice text-[22px] md:text-[26px] pb-s10 text-primary capitalize leading-tight">
                {guestName}
              </h3>
              <p className="text-[10px] text-text-muted mb-s5 tracking-[2px] uppercase">
                TỚI DỰ BỮA CƠM THÂN MẬT CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
