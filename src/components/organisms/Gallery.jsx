import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../atoms/SectionHeading";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSettings } from "../../hooks/use-site-settings";

const GalleryImage = ({ img, idx, onSelect }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isLarge = idx === 6;

  return (
    <div
      onClick={() => onSelect(idx)}
      className={`relative rounded-xl overflow-hidden shadow-sm cursor-pointer bg-slate-100 ${
        isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
      }`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary/10 border-t-primary/30 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={img.src}
        alt={img.alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors" />
    </div>
  );
};

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
        {images.map((img, idx) => (
          <GalleryImage key={idx} img={img} idx={idx} onSelect={setSelectedIndex} />
        ))}
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

