import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, User, MessageCircle, Users } from "lucide-react";
import SectionHeading from "../atoms/SectionHeading";

const WishForm = ({ scriptUrl }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "GUEST",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scriptUrl) {
      alert("Vui lòng cấu hình URL Google Sheets trước khi gửi!");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Since Google Apps Script often uses redirects which trigger CORS errors in browsers
      // despite working in 'no-cors' mode, we treat any response without as success.
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
      setFormData({ name: "", phone: "", role: "GUEST", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section style={{ padding: "24px 24px", background: "var(--bg-light)" }}>
      <SectionHeading subtitle="vui lòng dành ít thời gian">
        Xác Nhận Tham Dự & Gửi Lời Chúc
      </SectionHeading>

      <motion.div
        className="card"
        style={{
          padding: "30px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
          backgroundColor: "white",
        }}
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <CheckCircle2
                color="var(--primary)"
                size={60}
                style={{ marginBottom: "20px" }}
              />
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>
                Cảm ơn bạn!
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                Món quà tinh thần ý nghĩa của bạn đã được gửi đến chúng tôi.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    display: "block",
                    color: "var(--text-muted)",
                  }}
                >
                  HỌ & TÊN
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    color="var(--accent)"
                    style={{ position: "absolute", left: "12px", top: "15px" }}
                  />
                  <input
                    required
                    className="input-focus"
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    display: "block",
                    color: "var(--text-muted)",
                  }}
                >
                  QUAN HỆ
                </label>
                <div style={{ position: "relative" }}>
                  <Users
                    size={16}
                    color="var(--accent)"
                    style={{ position: "absolute", left: "12px", top: "15px" }}
                  />
                  <select
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                      appearance: "none",
                    }}
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="GUEST">Bạn của cô dâu & chú rể</option>
                    <option value="FAMILY_GROOM">Gia đình nhà trai</option>
                    <option value="FAMILY_BRIDE">Gia đình nhà gái</option>
                    <option value="COLLEAGUE">Đồng nghiệp</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    display: "block",
                    color: "var(--text-muted)",
                  }}
                >
                  LỜI CHÚC CỦA BẠN
                </label>
                <div style={{ position: "relative" }}>
                  <MessageCircle
                    size={16}
                    color="var(--accent)"
                    style={{ position: "absolute", left: "12px", top: "15px" }}
                  />
                  <textarea
                    required
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                      minHeight: "120px",
                    }}
                    placeholder="Hãy viết vài lời chúc ngọt ngào cho chúng tôi nhé..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "15px",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                {status === "loading" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <Send size={20} />
                )}
                GỬI LỜI CHÚC
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .input-focus:focus { outline: none; border-color: var(--primary) !important; box-shadow: 0 0 0 2px rgba(175, 14, 19, 0.1); }
      `}</style>
    </section>
  );
};

export default WishForm;
