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
        <p className="text-[18px] text-[#333] text-center relative z-[2] mb-0">
          Một hành trình mới bắt đầu từ tình yêu và sự lựa chọn ở bên nhau. Gia đình rất vui khi được chia sẻ khoảnh khắc này cùng bạn. Hẹn gặp bạn trong ngày trọng đại!
        </p>
        <img
          src="/assets/heart.png"
          alt="heart"
          className="absolute bottom-s50 right-s10 w-[80px] h-auto z-[1] opacity-85 mix-blend-multiply"
        />
      </motion.div>
    </section>
  );
};

export default ThankYouSection;
