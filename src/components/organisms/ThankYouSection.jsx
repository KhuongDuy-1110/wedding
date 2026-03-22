import React from "react";
import { motion } from "framer-motion";

const ThankYouSection = () => {
  return (
    <section className="py-s24 px-s20 bg-[#fdfdfd]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative max-w-full mx-auto bg-[url('/assets/paper.png')] bg-[length:100%_100%] bg-no-repeat bg-center pt-[50px] px-s40 pb-[70px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
      >

        <p className="font-brush text-[24px] text-[#333] text-center relative z-[2] mb-0">
          Chúng tôi vô cùng biết ơn tình cảm và sự ủng hộ của bạn trong suốt
          thời gian qua. Để kỷ niệm ngày hai chúng tôi nên duyên vợ chồng xin
          kính mời bạn cùng gia đình đến dự lễ cưới của chúng tôi. Sự hiện diện
          của bạn là niềm vinh dự lớn cho chúng tôi trong ngày hạnh phúc này.
        </p>
        <img
          src="/assets/heart.png"
          alt="heart"
          className="absolute bottom-s50 right-s10 w-[120px] h-auto z-[1] opacity-85 mix-blend-multiply"
        />
      </motion.div>
    </section>
  );
};

export default ThankYouSection;
