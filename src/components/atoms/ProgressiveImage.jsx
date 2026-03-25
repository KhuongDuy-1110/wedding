import React, { useState, useEffect } from "react";
import { getThumbnail, getLowResPlaceholder } from "../../utils/cloudinary";

const ProgressiveImage = ({
  src,
  alt,
  className = "",
  width = 800,
  loading = "lazy",
  style = {},
}) => {
  const [currentSrc, setCurrentSrc] = useState(getLowResPlaceholder(src));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mainImg = new Image();
    const finalUrl = getThumbnail(src, width);
    mainImg.src = finalUrl;
    mainImg.onload = () => {
      setCurrentSrc(finalUrl);
      setIsReady(true);
    };
  }, [src, width]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Blurred Placeholder */}
      <img
        src={getLowResPlaceholder(src)}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
        style={{ filter: "blur(20px)", transform: "scale(1.1)" }}
      />

      {/* Main Image */}
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ProgressiveImage;
