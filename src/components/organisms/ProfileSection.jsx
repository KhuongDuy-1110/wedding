import React from "react";
import { motion } from "framer-motion";
import "./ProfileSection.css";

const ProfileSection = () => {
  const bride = {
    role: "Cô dâu",
    name: "Lê Thị Nga",
    images: [
      "https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg",
      "https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg",
      "https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg",
    ],
  };

  const groom = {
    role: "Chú rể",
    name: "Phạm Văn Khải",
    images: [
      "https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg",
      "https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg",
      "https://i.pinimg.com/736x/76/4c/b1/764cb10e4ffba2e9bdd66571a4e128c9.jpg",
    ],
  };

  return (
    <section className="bg-white pt-s40 px-s20 overflow-hidden">
      {/* Bride Section */}
      <div className="profile-wrapper">
        {/* Large Image Left */}
        <div className="profile-large bride">
          <img
            src={bride.images[0]}
            alt="Bride"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        {/* Text Area Right */}
        <div className="profile-text-area bride">
          <h3 className="profile-role-title">{bride.role}</h3>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="font-brush profile-name-text"
          >
            {bride.name}
          </motion.p>
        </div>

        {/* Small Images */}
        <motion.div
          initial={{ x: 60 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="profile-small-container"
        >
          <div className="profile-small-img p-1 bride">
            <img
              src={bride.images[1]}
              alt="Bride 2"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="profile-small-img p-2 bride">
            <img
              src={bride.images[2]}
              alt="Bride 3"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Groom Section */}
      <div className="profile-wrapper ">
        {/* Large Image Right */}
        <div className="profile-large groom">
          <img
            src={groom.images[0]}
            alt="Groom"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        {/* Text Area Left */}
        <div className="profile-text-area groom">
          <h3 className="profile-role-title">{groom.role}</h3>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="font-brush profile-name-text"
          >
            {groom.name}
          </motion.p>
        </div>

        {/* Small Images */}
        <motion.div
          initial={{ x: -60 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="profile-small-container"
        >
          <div className="profile-small-img p-1 groom">
            <img
              src={groom.images[1]}
              alt="Groom 2"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="profile-small-img p-2 groom">
            <img
              src={groom.images[2]}
              alt="Groom 3"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileSection;
