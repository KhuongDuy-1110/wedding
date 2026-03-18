import React from "react";
import { motion } from "framer-motion";

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
    <section style={{ background: "#fff", padding: "40px 20px" }}>
      {/* Bride Section */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "520px",
          marginBottom: "80px",
        }}
      >
        {/* Large Image Left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "420px",
            zIndex: 1,
          }}
        >
          <img
            src={bride.images[0]}
            alt="Bride"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
            }}
          />
        </div>

        {/* Text Area Right */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: 0,
            width: "50%",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontFamily: "'Playfair Display', serif",
              color: "#111",
              letterSpacing: "1px",
              fontWeight: "normal",
              textTransform: "uppercase",
              marginBottom: "5px",
            }}
          >
            {bride.role}
          </h3>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="font-brush"
            style={{ fontSize: "32px", color: "#111", lineHeight: 1 }}
          >
            {bride.name}
          </motion.h2>
        </div>

        {/* Small Images */}
        <motion.div
          initial={{ x: 60 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: "49%",
              width: "43%",
              height: "280px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              pointerEvents: "auto",
            }}
          >
            <img
              src={bride.images[1]}
              alt="Bride 2"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: "4%",
              width: "43%",
              height: "280px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              pointerEvents: "auto",
            }}
          >
            <img
              src={bride.images[2]}
              alt="Bride 3"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Groom Section */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "520px",
          marginBottom: "40px",
        }}
      >
        {/* Large Image Right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "420px",
            zIndex: 1,
          }}
        >
          <img
            src={groom.images[0]}
            alt="Groom"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
            }}
          />
        </div>

        {/* Text Area Left */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            width: "50%",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontFamily: "'Playfair Display', serif",
              color: "#111",
              letterSpacing: "1px",
              fontWeight: "normal",
              textTransform: "uppercase",
              marginBottom: "5px",
            }}
          >
            {groom.role}
          </h3>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="font-brush"
            style={{ fontSize: "32px", color: "#111", lineHeight: 1 }}
          >
            {groom.name}
          </motion.h2>
        </div>

        {/* Small Images */}
        <motion.div
          initial={{ x: -60 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "4%",
              width: "43%",
              height: "280px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              pointerEvents: "auto",
            }}
          >
            <img
              src={groom.images[1]}
              alt="Groom 2"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "49%",
              width: "43%",
              height: "280px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              pointerEvents: "auto",
            }}
          >
            <img
              src={groom.images[2]}
              alt="Groom 3"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileSection;
