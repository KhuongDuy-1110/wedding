import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, QrCode, RefreshCcw } from "lucide-react";
import { trackEvent } from "../../features/admin/utils/tracker";

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

const Gifting = ({ side }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const allAccounts = [
    {
      bank: "TECHCOMBANK",
      account: "19036430751013",
      name: "PHAM VAN KHAI",
      type: "NHÀ TRAI",
      qrSrc: "/assets/bank/chure.png",
      role: "groom",
    },
    {
      bank: "TECHCOMBANK",
      account: "19036281687013",
      name: "LE THI NGA",
      type: "NHÀ GÁI",
      qrSrc: "/assets/bank/codau.png",
      role: "bride",
    },
  ];

  // Filter accounts based on side, or show both if no side is matched
  const accounts = side
    ? allAccounts.filter((acc) => acc.role === side)
    : allAccounts;

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
              onClick={() => {
                setIsFlipped(true);
                trackEvent("view_qr");
              }}
              className="flex items-center gap-s10 text-primary text-[11px] font-bold tracking-[2px] border-b border-primary/20 pb-1 mt-s20 hover:opacity-75 transition-opacity"
            >
              <QrCode size={16} />
              XEM QR MỪNG CƯỚI
            </button>
          </div>

          {/* Back Side: Accounts Row */}
          <div
            className="absolute inset-0 backface-hidden design-card p-s20 flex flex-col [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex flex-col gap-s15 flex-1 min-h-0 justify-center items-center">
              {accounts.map((acc, idx) => (
                <div
                  key={idx}
                  className={`flex flex-row items-center gap-s20  w-full max-w-[400px] relative`}
                >
                  <div className="w-[120px] aspect-square flex items-center justify-center">
                    <img
                      src={acc.qrSrc}
                      alt="QR Code"
                      className="w-full h-full rounded-[6px] object-contain border border-primary/5"
                    />
                  </div>

                  <div className="flex-1 flex flex-col text-left">
                    <h4 className="font-brice text-[14px] text-primary mb-1">
                      {acc.bank}
                    </h4>
                    <p className="text-[11px] font-bold text-text-muted uppercase mb-1">
                      {acc.name}
                    </p>
                    <p className="text-[12px] font-mono font-medium text-text-muted mb-s10 select-all">
                      {acc.account}
                    </p>

                    <button
                      className="btn-primary py-s10 px-s18 text-[10px] w-fit rounded-full shadow-sm"
                      onClick={() => {
                        navigator.clipboard.writeText(acc.account);
                        alert("Đã sao chép số tài khoản!");
                      }}
                    >
                      SAO CHÉP
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsFlipped(false)}
              className="mt-s15 flex items-center justify-center gap-s5 text-text-muted text-[10px] font-bold hover:text-primary transition-colors"
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
