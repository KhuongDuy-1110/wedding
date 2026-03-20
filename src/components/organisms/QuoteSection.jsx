import React from "react";
import { motion } from "framer-motion";

const QuoteSection = () => {
  return (
    <section className="py-s24 px-s20 bg-[#fdfdfd]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, margin: "-50px" }}
        className="relative max-w-[800px] mx-auto bg-[url('/assets/paper.png')] bg-[length:100%_100%] bg-no-repeat bg-center pt-s50 pr-s40 pb-s70 pl-s40 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
      >
        <p className="font-brush text-[24px] leading-[1.8] text-[#333] text-center relative z-[2]">
          "Tình cảm ấy, chẳng cần cứ phải hét to lên cho cả thế giới biết, chỉ
          cần thỏ thẻ cho một người là cả thế giới của mình nghe là đủ rồi. Điều
          quan trọng nhất là đến cuối đường vẫn còn ở bên nhau, đi cạnh nhau,
          nắm tay nhau, rung động vì nhau. Cứ thế thôi là đủ rồi!"
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
