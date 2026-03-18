import React from "react";
import { motion } from "framer-motion";

const QuoteSection = () => {
  return (
    <section className="section-padding" style={{ background: "#fdfdfd" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="design-card" 
        style={{ 
          padding: "40px 30px", 
          textAlign: "center", 
          position: "relative",
          marginBottom: 0
        }}
      >
        <p className="script" style={{ 
          fontSize: "18px", 
          lineHeight: "1.8", 
          color: "#444",
          marginBottom: "20px"
        }}>
          "Tình cảm ấy, chẳng cần cứ phải hét to lên cho cả thế giới biết, chỉ cần thỏ thẻ cho một người là cả thế giới của mình nghe là đủ rồi. Điều quan trọng nhất là đến cuối đường vẫn còn ở bên nhau, đi cạnh nhau, nắm tay nhau, rung động vì nhau. Cứ thế thôi là đủ rồi!"
        </p>
        
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#E54D42", // A vibrant red like in the screenshot
              WebkitMaskImage: "url(/assets/trai-tim.svg)",
              maskImage: "url(/assets/trai-tim.svg)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default QuoteSection;
