import React from "react";
import { motion } from "framer-motion";

const QuoteSection = () => {
  return (
    <section className="py-s24  px-s20 bg-[#fdfdfd]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative max-w-full mx-auto bg-[url('/assets/paper.png')] bg-[length:100%_100%] bg-no-repeat bg-center pt-s50 pr-s40 pb-s70 pl-s40 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
      >
        <p className="text-[18px] text-[#333] text-center relative z-[2]">
          "Bắt đầu từ vài tin nhắn vu vơ, hai đứa thân nhau lúc nào không hay vì đều thích đi đây đi đó.
          Một Khương giản dị, ấm áp bù trừ cho một Giang hướng nội nhưng cứ cạnh người yêu là nói nhiều.<br />
          Tụi mình chẳng ai hoàn hảo, nhưng luôn cố gắng hiểu nhau hơn mỗi ngày.
          Sắp tới, hành trình khám phá cuộc sống của hai đứa sẽ chính thức gộp làm một!"
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

export default QuoteSection;
