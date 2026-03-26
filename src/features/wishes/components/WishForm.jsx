import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, User, MessageCircle, Users, Loader2 } from "lucide-react";
import SectionHeading from "../../../components/atoms/SectionHeading";
import { useCreateWish } from "../hooks/use-wishes";

const WishForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "GUEST",
    message: "",
  });

  const createMutation = useCreateWish();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guestPath = 
      formData.role === "FAMILY_GROOM" ? "/r" : 
      formData.role === "FAMILY_BRIDE" ? "/d" : 
      "/";

    createMutation.mutate({ ...formData, guest_path_name: guestPath }, {
      onSuccess: () => {
        setFormData({ name: "", phone: "", role: "GUEST", message: "" });
      },
    });
  };

  return (
    <section className="py-s40 px-s24 bg-bg-light">
      <SectionHeading subtitle="vui lòng dành ít thời gian">
        Gửi Lời Chúc Đến Chúng Mình
      </SectionHeading>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="card p-s30 shadow-[0_15px_35px_rgba(0,0,0,0.05)] bg-white max-w-[600px] mx-auto"
      >
        <AnimatePresence mode="wait">
          {createMutation.isSuccess ? (
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
              <h3 className="text-[24px] mb-s10">Cảm ơn bạn!</h3>
              <p className="text-text-muted">
                Món quà tinh thần ý nghĩa của bạn đã được gửi đến chúng tôi.
              </p>
              <button
                onClick={() => createMutation.reset()}
                className="btn-accent mt-s24 text-white p-s10 px-s24"
              >
                Gửi Thêm Lời Chúc
              </button>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-s20">
                <div>
                  <label className="text-[12px] font-bold mb-s8 block text-text-muted">
                    SỐ ĐIỆN THOẠI
                  </label>
                  <input
                    className="input-field"
                    placeholder="Không bắt buộc"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
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
                      className="input-field appearance-none pl-[38px]"
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
                disabled={createMutation.isPending}
                className="btn-primary w-full p-s15 text-[18px] mt-s10"
              >
                {createMutation.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Loader2 size={20} />
                  </motion.div>
                ) : (
                  <>
                    <Send size={20} className="mr-s8" /> GỬI LỜI CHÚC
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default WishForm;
