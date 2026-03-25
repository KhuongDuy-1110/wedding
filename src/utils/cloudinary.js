export const getThumbnail = (url, width = 600, quality = "auto") => {
  if (!url || !url.includes("cloudinary.com")) return url;
  try {
    return url.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);
  } catch (e) {
    return url;
  }
};

export const getLowResPlaceholder = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  try {
    // Very small, low quality, blurred for a nice progressive load effect
    return url.replace("/upload/", `/upload/w_50,q_10,e_blur:1000,f_auto/`);
  } catch (e) {
    return url;
  }
};
