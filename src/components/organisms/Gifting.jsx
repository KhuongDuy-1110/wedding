import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, QrCode, RefreshCcw } from "lucide-react";

const GiftingCard = ({ acc, idx }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex-1 min-w-0 h-[380px] [perspective:1000px]">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="w-full h-full relative [transform-style:preserve-3d]"
      >
        {/* Front Side: Message */}
        <div
          className="absolute inset-0 backface-hidden design-card p-s20 flex flex-col items-center justify-center text-center bg-[#fffafa]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-s10 right-s10 text-[9px] font-bold text-primary tracking-[1px] opacity-60">
            {acc.type}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-primary/80 font-serif text-[13px] leading-[1.8] italic px-s5">
              "Sự hiện diện của bạn là niềm vinh dự cho mình và gia đình. Mong
              bạn sắp xếp thời gian tới dự. Trân trọng và chúc sức khỏe."
            </p>
          </div>

          <button
            onClick={() => setIsFlipped(true)}
            className="flex items-center gap-s8 text-primary text-[10px] font-bold tracking-[1px] hover:opacity-70 transition-opacity mt-s15"
          >
            <QrCode size={14} />
            XEM QR MỪNG CƯỚI
          </button>
        </div>

        {/* Back Side: QR & Account */}
        <div
          className="absolute inset-0 backface-hidden design-card p-s15 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-s5 right-s8 text-[8px] font-bold text-primary tracking-[1px] opacity-60">
            {acc.type}
          </div>

          <div className="mb-s10 w-full flex-1 flex flex-col items-center justify-center">
            <img
              src={`https://img.vietqr.io/image/${acc.bankId}-${acc.account}-compact.jpg?accountName=${encodeURIComponent(acc.name)}`}
              alt="QR Code"
              className="w-full max-w-[150px] aspect-square mx-auto rounded-[8px] shadow-sm border border-[#f5f5f5]"
            />
          </div>

          <h4 className="font-brice text-[15px] mb-s2 text-primary">
            {acc.bank}
          </h4>

          <p className="text-text-muted text-[10px] uppercase font-semibold mb-s5 truncate w-full">
            {acc.name}
          </p>
          <p className="text-text-muted text-[11px] font-bold mb-s10 break-all select-all">
            {acc.account}
          </p>

          <div className="flex flex-col w-full gap-s8">
            <button
              className="btn-primary py-[8px] text-[10px] w-full"
              onClick={() => {
                navigator.clipboard.writeText(acc.account);
                alert("Đã sao chép số tài khoản!");
              }}
            >
              SAO CHÉP
            </button>
            <button
              onClick={() => setIsFlipped(false)}
              className="flex items-center justify-center gap-s5 text-text-muted text-[9px] font-semibold hover:text-primary transition-colors"
            >
              <RefreshCcw size={10} /> QUAY LẠI
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Gifting = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const accounts = [
    {
      bank: "MBBANK",
      account: "8838683860",
      name: "PHẠM VĂN KHẢI",
      type: "NHÀ TRAI",
      bankId: "MB",
    },
    {
      bank: "MBBANK",
      account: "1234567890",
      name: "LÊ NGA",
      type: "NHÀ GÁI",
      bankId: "MB",
    },
  ];

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="section-title">
        <h2>GỬI MỪNG CƯỚI</h2>
        <p>Với một vài chi tiết nhỏ</p>
      </div>

      <div className="max-w-[600px] mx-auto px-s20 mt-s40 [perspective:1000px] h-[300px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.7,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="w-full h-full relative [transform-style:preserve-3d]"
        >
          {/* Front Side: Unified Message */}
          <div
            className="absolute inset-0 backface-hidden design-card p-s30 flex flex-col items-center justify-center text-center bg-[#fffafa]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-primary/90 font-serif text-[15px] leading-[1.8] italic max-w-[400px]">
                "Sự hiện diện của bạn là niềm vinh dự cho mình và gia đình. Mong
                bạn sắp xếp thời gian tới dự. Trân trọng và chúc sức khỏe."
              </p>
            </div>

            <button
              onClick={() => setIsFlipped(true)}
              className="flex items-center gap-s10 text-primary text-[11px] font-bold tracking-[2px] border-b border-primary/20 pb-1 mt-s20 hover:opacity-75 transition-opacity"
            >
              <QrCode size={16} />
              XEM QR MỪNG CƯỚI
            </button>
          </div>

          {/* Back Side: Two Accounts Row */}
          <div
            className="absolute inset-0 backface-hidden design-card p-s12 flex flex-col [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex flex-row gap-s8 flex-1 min-h-0">
              {accounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col min-w-0 bg-[#fefefe] border border-[#f0f0f0] rounded-[8px] p-s8 text-center relative"
                >
                  <div className="text-[7px] font-bold text-primary absolute top-2 right-2 opacity-50">
                    {acc.type}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center mb-s5">
                    <img
                      src={`https://img.vietqr.io/image/${acc.bankId}-${acc.account}-compact.jpg?accountName=${encodeURIComponent(acc.name)}`}
                      alt="QR Code"
                      className="w-full max-w-[130px] aspect-square rounded-[6px] shadow-sm border border-white"
                    />
                  </div>

                  <h4 className="font-brice text-[13px] text-primary mb-s1">
                    {acc.bank}
                  </h4>
                  <p className="text-[9px] uppercase font-bold text-text-muted mb-s8 truncate w-full px-s2">
                    {acc.name}
                  </p>

                  <button
                    className="btn-primary py-[7px] text-[10px] w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(acc.account);
                      alert("Đã sao chép số tài khoản!");
                    }}
                  >
                    SAO CHÉP
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsFlipped(false)}
              className="mt-s10 flex items-center justify-center gap-s5 text-text-muted text-[10px] font-bold hover:text-primary transition-colors"
            >
              <RefreshCcw size={14} /> QUAY LẠI
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gifting;
