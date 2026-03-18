import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "../atoms/SectionHeading";

const Gallery = () => {
  const images = [
    { src: "/assets/couple.png", alt: "Main Photo" },
    { src: "/assets/gallery-1.png", alt: "Wedding Couple in Garden" },
    { src: "/assets/gallery-2.png", alt: "Wedding Rings" },
  ];

  return (
    <section style={{ padding: "24px 24px" }}>
      <SectionHeading subtitle="với một vài khoảnh khắc đẹp">
        Album hình cưới
      </SectionHeading>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          padding: "10px",
        }}
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            style={{
              aspectRatio: idx === 0 ? "unset" : "1/1",
              gridColumn: idx === 0 ? "span 2" : "span 1",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "2px solid white",
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
