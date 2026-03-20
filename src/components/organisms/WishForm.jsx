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
    <section className="py-s24 px-s24 bg-bg-light">
      <SectionHeading subtitle="vui lòng dành ít thời gian">
        Xác Nhận Tham Dự & Gửi Lời Chúc
      </SectionHeading>

      <motion.div
        className="card p-s30 shadow-[0_15px_35px_rgba(0,0,0,0.05)] bg-white"
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-s40 px-0"
            >
              <CheckCircle2
                color="var(--color-primary)"
                size={60}
                className="mb-s20 mx-auto"
              />
              <h3 className="text-[24px] mb-s10">
                Cảm ơn bạn!
              </h3>
              <p className="text-text-muted">
                Món quà tinh thần ý nghĩa của bạn đã được gửi đến chúng tôi.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-s20"
            >
              <div>
                <label className="text-[12px] font-bold mb-s8 block text-text-muted">
                  HỌ & TÊN
                </label>
                <div className="relative">
                  <User
                    size={16}
                    color="var(--color-accent)"
                    className="absolute left-[12px] top-[15px]"
                  />
                  <input
                    required
                    className="input-field"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold mb-s8 block text-text-muted">
                  QUAN HỆ
                </label>
                <div className="relative">
                  <Users
                    size={16}
                    color="var(--color-accent)"
                    className="absolute left-[12px] top-[15px]"
                  />
                  <select
                    className="input-field appearance-none"
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
                <label className="text-[12px] font-bold mb-s8 block text-text-muted">
                  LỜI CHÚC CỦÂ BẠN
                </label>
                <div className="relative">
                  <MessageCircle
                    size={16}
                    color="var(--color-accent)"
                    className="absolute left-[12px] top-[15px]"
                  />
                  <textarea
                    required
                    className="input-field min-h-[120px]"
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
                className="btn-primary w-full p-s15 text-[18px] mt-s10"
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
    </section>
  );
};

export default WishForm;
