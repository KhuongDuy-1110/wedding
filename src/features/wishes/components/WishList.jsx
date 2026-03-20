import React from "react";
import { motion } from "framer-motion";
import { useWishes } from "../hooks/use-wishes";
import { User, MessageCircle } from "lucide-react";

const roleLabels = {
  GUEST: "Bạn bè",
  FAMILY_GROOM: "Gia đình nhà trai",
  FAMILY_BRIDE: "Gia đình nhà gái",
  COLLEAGUE: "Đồng nghiệp",
};

const WishList = () => {
  const { data: wishes, isLoading, isError } = useWishes();

  if (isLoading) {
    return <div className="text-center py-s40">Đang tải lời chúc...</div>;
  }

  if (isError) {
    return <div className="text-center py-s40">Không thể tải lời chúc</div>;
  }

  return (
    <section className="py-s40 bg-white">
      <div className="max-w-[800px] mx-auto px-s24">
        <h3 className="text-[20px] font-bold text-center mb-s30 uppercase tracking-[2px]">
          Lời Chúc Gần Đây
        </h3>

        <div className="flex flex-col gap-s15 h-[500px] overflow-y-auto pr-s10 scrollbar-thin">
          {wishes?.length === 0 && (
            <p className="text-center text-text-muted italic">
              Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!
            </p>
          )}

          {wishes?.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#fdf9f9] border border-[#f5ecec] p-s20 rounded-[12px] shadow-sm relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-[40px] h-[40px] bg-primary/5 rounded-bl-full flex items-center justify-center">
                <MessageCircle size={14} color="var(--color-primary)" className="opacity-40" />
              </div>

              <div className="flex items-start gap-s15 mb-s10">
                <div className="w-[45px] h-[45px] rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <User size={20} color="var(--color-accent)" />
                </div>
                <div>
                  <h4 className="font-bold text-[16px] text-[#333]">
                    {wish.name}
                  </h4>
                  <span className="text-[11px] uppercase tracking-[1px] text-primary/70 font-medium">
                    {roleLabels[wish.role] || "Khách mời"}
                  </span>
                </div>
              </div>

              <p className="text-[14px] leading-[1.6] text-[#666] italic">
                "{wish.message}"
              </p>

              <div className="mt-s10 text-right">
                <span className="text-[10px] text-text-muted">
                  {new Date(wish.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WishList;
