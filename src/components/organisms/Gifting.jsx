import React from "react";
import { motion } from "framer-motion";
import { Landmark, Copy } from "lucide-react";

const Gifting = () => {
  const accounts = [
    {
      bank: "MBBANK",
      account: "8838683860",
      name: "NGUYỄN TẤN ĐẠT",
      type: "NHÀ TRAI",
    },
    {
      bank: "MBBANK",
      account: "1234567890",
      name: "TRẦN THỊ DIỆU NHI",
      type: "NHÀ GÁI",
    },
  ];

  return (
    <section className="section-padding" style={{ background: "white" }}>
      <div className="section-title">
        <h2>GỬI MỪNG CƯỚI</h2>
        <p>Với một vài chi tiết nhỏ</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "40px" }}>
        {accounts.map((acc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="design-card"
            style={{
              padding: "30px",
              position: "relative",
              textAlign: "center"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                fontSize: "10px",
                fontWeight: "bold",
                color: "var(--primary)",
                letterSpacing: "2px",
                opacity: 0.6
              }}
            >
              {acc.type}
            </div>

            <div style={{ 
              width: "50px", 
              height: "50px", 
              background: "#fff9f9", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto 15px"
            }}>
              <Landmark size={24} color="var(--primary)" />
            </div>

            <h4 className="font-brice" style={{ fontSize: "20px", marginBottom: "10px", color: "var(--primary)" }}>
              {acc.bank}
            </h4>
            
            <div style={{ 
              background: "#fdfdfd", 
              padding: "15px", 
              borderRadius: "8px", 
              border: "1px dashed #eee",
              margin: "15px 0"
            }}>
              <p
                style={{
                  letterSpacing: "4px",
                  fontSize: "24px",
                  fontWeight: "300",
                  color: "var(--text-dark)",
                }}
              >
                {acc.account}
              </p>
            </div>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600"
              }}
            >
              {acc.name}
            </p>

            <button
              className="btn-primary"
              onClick={() => {
                navigator.clipboard.writeText(acc.account);
                alert("Đã sao chép số tài khoản!");
              }}
              style={{
                background: "#fff9f9",
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                boxShadow: "none",
                marginTop: "20px",
                fontSize: "12px",
                padding: "10px 24px",
                margin: "20px auto 0",
                width: "fit-content"
              }}
            >
              <Copy size={14} style={{ marginRight: "8px" }} />
              SAO CHÉP
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Gifting;
