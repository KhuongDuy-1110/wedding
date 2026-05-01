import React from "react";
import { motion } from "framer-motion";
import "./ProfileSection.css";
import { useSiteSettings } from "../../hooks/use-site-settings";

const ProfileSection = () => {
  const { data: settings } = useSiteSettings();

  const bride = {
    role: "17.03.2022",
    name: "First message",
    images: [
      settings?.bride_main || "",
      settings?.bride_small_1 || "",
      settings?.bride_small_2 || "",
    ],
  };

  const groom = {
    role: "Chú rể",
    name: "Duy Khương",
    images: [
      settings?.groom_main || "",
      settings?.groom_small_1 || "",
      settings?.groom_small_2 || "",
    ],
  };

  return (
    <section className="bg-white pt-0 px-s20 overflow-hidden relative">
      {/* Profile Heading */}
      <div className="profile-heading-container">
        <div className="profile-heading-content">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="profile-story-title"
          >
            {/* THE STORY{" "}
            <span className="italic font-couple lowercase text-primary">
              of
            </span>{" "}
            LOVE */}
            THÔNG TIN HÔN LỄ
          </motion.h2>
        </div>
      </div>
      {/* Bride Section */}
      <div className="profile-wrapper">
        {/* Large Image Left */}
        <div className="profile-large bride">
          <img
            src={bride.images[0]}
            alt="Bride"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Area Right */}
        <div className="profile-text-area bride">
          <p className="profile-role-title">Lễ Ăn Hỏi</p>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="font-brush font-bold profile-name-text"
          >
            05 . 06 . 2026
          </motion.p>
          <p className="profile-role-title" style={{ paddingTop: '20px' }}>Diễn ra lúc 8h30 tại tư gia nhà gái</p>
        </div>

        {/* Small Images */}
        <motion.div
          initial={{ x: 60 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="profile-small-container"
        >
          <div className="profile-small-img bride">
            <img
              src={bride.images[1]}
              alt="Bride 2"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="profile-small-img bride">
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
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Area Left */}
        <div className="profile-text-area groom">
          <h3 className="profile-role-title">Lễ Thành Hôn</h3>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="font-brush font-bold profile-name-text"
          >
            06 . 06 . 2026
          </motion.p>
          <p className="profile-role-title" style={{ paddingTop: '20px' }}>Diễn ra lúc 10h00 tại tư gia nhà trai</p>
        </div>

        {/* Small Images */}
        <motion.div
          initial={{ x: -60 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="profile-small-container"
        >
          <div className="profile-small-img groom">
            <img
              src={groom.images[1]}
              alt="Groom 2"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="profile-small-img groom">
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
