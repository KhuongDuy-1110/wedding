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
    <section className="py-s24 px-s24">
      <SectionHeading subtitle="với một vài khoảnh khắc đẹp">
        Album hình cưới
      </SectionHeading>

      <div className="grid grid-cols-2 gap-s12 p-s10">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`${idx === 0 ? "aspect-auto col-span-2" : "aspect-square col-span-1"} rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-2 border-white`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
