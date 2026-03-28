import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, QrCode, RefreshCcw, Download } from "lucide-react";
import { trackEvent } from "../../features/admin/utils/tracker";

const handleDownload = (url, name) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = `QR_${name.replace(/\s+/g, "_")}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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
            className="flex items-center gap-s8 text-primary text-[12px] font-bold tracking-[1px] hover:opacity-70 transition-opacity mt-s15"
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
            <div className="flex gap-2">
              <button
                className="btn-primary py-[8px] text-[10px] flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(acc.account);
                  alert("Đã sao chép số tài khoản!");
                }}
              >
                SAO CHÉP
              </button>
              <button
                className="bg-gray-100 text-gray-700 py-[8px] text-[10px] flex-1 rounded-full font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-1"
                onClick={() =>
                  handleDownload(
                    `https://img.vietqr.io/image/${acc.bankId}-${acc.account}-compact.jpg?accountName=${encodeURIComponent(acc.name)}`,
                    acc.name,
                  )
                }
              >
                <Download size={12} /> TẢI QR
              </button>
            </div>
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

  React.useEffect(() => {
    const checkFlip = () => {
      if (sessionStorage.getItem("auto_flip_gifting") === "true") {
        setIsFlipped(true);
        sessionStorage.removeItem("auto_flip_gifting");
      }
    };

    // Check initially and also on scroll to be safe
    checkFlip();
    window.addEventListener("scroll", checkFlip);
    return () => window.removeEventListener("scroll", checkFlip);
  }, []);

  const allAccounts = [
    {
      bank: "TECHCOMBANK",
      account: "19036430751013",
      name: "PHAM VAN KHAI",
      type: "NHÀ TRAI",
      qrSrc: "/assets/bank/chure.png",
      role: "groom",
      bankId: "TCB",
    },
    {
      bank: "TECHCOMBANK",
      account: "19036281687013",
      name: "LE THI NGA",
      type: "NHÀ GÁI",
      qrSrc: "/assets/bank/codau.png",
      role: "bride",
      bankId: "TCB",
    },
  ];

  // Filter accounts based on side
  const accounts =
    side === "both"
      ? allAccounts
      : allAccounts.filter((acc) => acc.role === side);

  return (
    <section id="gifting-section" className="pb-s20 bg-white overflow-hidden">
      <div className="section-title">
        <h2>GỬI MỪNG CƯỚI</h2>
        <p>Với một vài chi tiết nhỏ</p>
      </div>

      <div className="max-w-[600px] mx-auto px-s20 mt-s40 [perspective:1000px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.7,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="w-full relative [transform-style:preserve-3d] min-h-[350px]"
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
              className="flex items-center gap-s10 text-primary text-[13px] font-bold tracking-[2px] border-b border-primary/20 pb-1 mt-s20 hover:opacity-75 transition-opacity"
            >
              <QrCode size={16} />
              XEM QR MỪNG CƯỚI
            </button>
          </div>

          {/* Back Side: Accounts Row */}
          <div
            className="backface-hidden design-card p-s30 flex flex-col items-center [transform:rotateY(180deg)] min-h-full"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-full flex flex-col items-center gap-s30 mb-s30">
              {accounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-s15 w-full max-w-[450px] relative p-s5 bg-transparent"
                >
                  {/* Left: QR Code */}
                  <div className="w-[100px] aspect-square flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-xl p-s8">
                    <img
                      src={acc.qrSrc}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1 flex flex-col text-left">
                    <h4 className="font-brice text-[14px] text-primary mb-0.5">
                      {acc.bank}
                    </h4>
                    <p className="font-bold text-text-muted text-[12px] uppercase mb-1">
                      {acc.name}
                    </p>
                    <p className="text-[14px] font-mono font-bold text-primary mb-s10 select-all tracking-wider">
                      {acc.account}
                    </p>

                    <div className="flex gap-2">
                      <button
                        className="bg-primary text-white py-s6 px-s12 text-[10px] rounded-full font-bold shadow-sm hover:bg-primary/90 transition-all"
                        onClick={() => {
                          navigator.clipboard.writeText(acc.account);
                          alert("Đã sao chép số tài khoản!");
                        }}
                      >
                        SAO CHÉP
                      </button>
                      <button
                        className="bg-gray-100 text-gray-700 py-s6 px-s12 text-[10px] rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-1 border border-gray-200"
                        onClick={() => handleDownload(acc.qrSrc, acc.name)}
                      >
                        <Download size={10} /> TẢI QR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsFlipped(false)}
              className="flex items-center justify-center gap-s5 text-text-muted text-[10px] font-bold hover:text-primary transition-colors py-s8 px-s15 border border-gray-100 rounded-full hover:bg-gray-50"
            >
              <RefreshCcw size={12} /> QUAY LẠI
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gifting;
