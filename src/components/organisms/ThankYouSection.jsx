import React from "react";
import { motion } from "framer-motion";

const ThankYouSection = () => {
  return (
    <section style={{ padding: "24px 20px", background: "#fdfdfd" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, margin: "-50px" }}
        style={{
          position: "relative",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundImage: "url('/assets/paper.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          padding: "50px 40px 70px 40px",
          filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.1))",
        }}
      >
        <p
          className="font-brush"
          style={{
            fontSize: "24px",
            lineHeight: "1.8",
            color: "#333",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            marginBottom: 0,
          }}
        >
          Chúng tôi vô cùng biết ơn tình cảm và sự ủng hộ của bạn trong suốt
          thời gian qua. Để kỷ niệm ngày hai chúng tôi nên duyên vợ chồng xin
          kính mời bạn cùng gia đình đến dự lễ cưới của chúng tôi. Sự hiện diện
          của bạn là niềm vinh dự lớn cho chúng tôi trong ngày hạnh phúc này.
        </p>
        <img
          src="/assets/heart.png"
          alt="heart"
          style={{
            position: "absolute",
            bottom: "50px",
            right: "10px",
            width: "120px",
            height: "auto",
            zIndex: 1,
            opacity: 0.85,
            mixBlendMode: "multiply",
          }}
        />
      </motion.div>
    </section>
  );
};

export default ThankYouSection;
