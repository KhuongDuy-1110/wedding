import React from "react";
import { motion } from "framer-motion";

const ProfileSection = () => {
  const bride = {
    role: "Cô dâu",
    name: "Lê Nga",
    images: [
      "https://i.pinimg.com/1200x/53/d5/9b/53d59bb9ff66117c3674e403669224ae.jpg",
      "https://i.pinimg.com/1200x/53/d5/9b/53d59bb9ff66117c3674e403669224ae.jpg",
      "https://i.pinimg.com/1200x/53/d5/9b/53d59bb9ff66117c3674e403669224ae.jpg",
    ],
  };

  const groom = {
    role: "Chú rể",
    name: "Phạm Khải",
    images: [
      "https://i.pinimg.com/1200x/53/d5/9b/53d59bb9ff66117c3674e403669224ae.jpg",
      "https://i.pinimg.com/1200x/53/d5/9b/53d59bb9ff66117c3674e403669224ae.jpg",
      "https://i.pinimg.com/1200x/53/d5/9b/53d59bb9ff66117c3674e403669224ae.jpg",
    ],
  };

  return (
    <section style={{ background: "#fff", padding: "24px 20px" }}>
      {/* Bride Section */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "80px",
          alignItems: "stretch",
        }}
      >
        {/* Large Image Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ flex: 1, height: "420px", overflow: "hidden" }}
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
        </motion.div>

        {/* Content Right */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: "left", marginBottom: "20px" }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontFamily: "'Playfair Display', serif",
                color: "#333",
                letterSpacing: "2px",
                fontWeight: "normal",
                marginBottom: "5px",
              }}
            >
              {bride.role}
            </h3>
            <h2
              className="font-brush"
              style={{ fontSize: "36px", color: "#333", lineHeight: 1 }}
            >
              {bride.name}
            </h2>
          </motion.div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
              flex: 1,
              marginLeft: "-40px",
              position: "relative",
              zIndex: 10,
              marginBottom: "40px",
            }}
          >
            <motion.div
              initial={{ x: 40 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                flex: 1,
                height: "200px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={bride.images[1]}
                alt="Bride 2"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
            <motion.div
              initial={{ x: 40 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                flex: 1,
                height: "200px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={bride.images[2]}
                alt="Bride 3"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Groom Section */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "40px",
          alignItems: "stretch",
        }}
      >
        {/* Content Left */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: "right", marginBottom: "20px" }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontFamily: "'Playfair Display', serif",
                color: "#333",
                letterSpacing: "2px",
                fontWeight: "normal",
                marginBottom: "5px",
              }}
            >
              {groom.role}
            </h3>
            <h2
              className="font-brush"
              style={{ fontSize: "36px", color: "#333", lineHeight: 1 }}
            >
              {groom.name}
            </h2>
          </motion.div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
              flex: 1,
              marginRight: "-40px",
              position: "relative",
              zIndex: 10,
              marginBottom: "40px",
            }}
          >
            <motion.div
              initial={{ x: -40 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                flex: 1,
                height: "200px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={groom.images[1]}
                alt="Groom 2"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
            <motion.div
              initial={{ x: -40 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                flex: 1,
                height: "200px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={groom.images[2]}
                alt="Groom 3"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Large Image Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ flex: 1, height: "420px", overflow: "hidden" }}
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
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileSection;
