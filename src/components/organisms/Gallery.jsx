import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../atoms/SectionHeading";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSettings } from "../../hooks/use-site-settings";

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { data: settings } = useSiteSettings();

  const galleryList = settings?.gallery_list ? JSON.parse(settings.gallery_list) : [];

  const images = galleryList.length > 0 
    ? galleryList.map((url, i) => ({ src: url, alt: `Wedding Photo ${i + 1}` }))
    : [
        { src: "/assets/couple.png", alt: "Main Photo" },
        { src: "/assets/gallery-1.png", alt: "Wedding Photo" },
        { src: "/assets/trai-tim.jpg", alt: "Love Moment" },
      ];

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-s24 px-s24">
      <SectionHeading subtitle="với một vài khoảnh khắc đẹp">
        Album hình cưới
      </SectionHeading>

      <div className="grid grid-cols-3 gap-s8 p-s10 auto-rows-[100px] md:auto-rows-[150px]">
        {images.map((img, idx) => {
          // Define pattern: index 6 (7th image) is large
          const isLarge = idx === 6;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, delay: (idx % 9) * 0.05 }}
              viewport={{ once: true, margin: "-20px" }}
              onClick={() => setSelectedIndex(idx)}
              className={`relative rounded-xl overflow-hidden shadow-sm cursor-pointer ${
                isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors" />
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-s20"
          >
            {/* Close Button */}
            <button
              className="absolute top-s24 right-s24 text-white hover:text-accent transition-colors z-[10001]"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-s10 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-all z-[10001] bg-black/20 p-2 rounded-full backdrop-blur-sm"
              onClick={handlePrev}
            >
              <ChevronLeft size={40} />
            </button>

            <button
              className="absolute right-s10 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-all z-[10001] bg-black/20 p-2 rounded-full backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight size={40} />
            </button>

            {/* Image Container */}
            <motion.div
              layoutId={`img-${selectedIndex}`}
              className="relative max-w-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain border-4 border-white/10"
              />
              
              {/* Index Indicator */}
              <div className="absolute -bottom-s40 left-1/2 -translate-x-1/2 text-white/70 text-[14px]">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;

