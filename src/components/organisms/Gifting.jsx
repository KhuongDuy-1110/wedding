import React from "react";
import { motion } from "framer-motion";
import { Landmark, Copy } from "lucide-react";

const Gifting = () => {
  const accounts = [
    {
      bank: "MBBANK",
      account: "8838683860", // Replace with real account if needed
      name: "PHẠM VĂN KHẢI",
      type: "NHÀ TRAI",
      bankId: "MB",
    },
    {
      bank: "MBBANK",
      account: "1234567890", // Replace with real account if needed
      name: "LÊ NGA",
      type: "NHÀ GÁI",
      bankId: "MB",
    },
  ];

  return (
    <section className="section-padding" style={{ background: "white" }}>
      <div className="section-title">
        <h2>GỬI MỪNG CƯỚI</h2>
        <p>Với một vài chi tiết nhỏ</p>
      </div>

      <div
        className="responsive-flex"
        style={{
          marginTop: "40px",
        }}
      >
        {accounts.map((acc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="design-card"
            style={{
              padding: "30px",
              position: "relative",
              textAlign: "center",
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
                opacity: 0.6,
              }}
            >
              {acc.type}
            </div>

            {/* QR Code Section */}
            <div style={{ marginBottom: "20px" }}>
              <img
                src={`https://img.vietqr.io/image/${acc.bankId}-${acc.account}-compact.jpg?accountName=${encodeURIComponent(acc.name)}`}
                alt="QR Code"
                style={{
                  width: "180px",
                  height: "180px",
                  margin: "0 auto",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #f0f0f0",
                }}
              />
            </div>

            <h4
              className="font-brice"
              style={{
                fontSize: "20px",
                marginBottom: "5px",
                color: "var(--primary)",
              }}
            >
              {acc.bank}
            </h4>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              {acc.name}
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              {acc.account}
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
                width: "fit-content",
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
