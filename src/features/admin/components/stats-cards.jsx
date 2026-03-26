import React from "react";

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      label: "Số khách (Unique)",
      value: stats.total,
      color: "from-blue-500 to-blue-400",
    },
    {
      label: "Đã mở thiệp",
      value: `${stats.pctOpened}%`,
      color: "from-green-500 to-green-400",
    },
    {
      label: "Xem hết 100%",
      value: `${stats.pctScrolled}%`,
      color: "from-orange-500 to-orange-400",
    },
    {
      label: "Xem QR mừng cưới",
      value: stats.qrViewed,
      color: "from-pink-500 to-pink-400",
    },
    {
      label: "Số lượt xem (Total)",
      value: stats.totalVisits,
      color: "from-purple-500 to-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statItems.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div
            className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}
          >
            {s.value}
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter sm:tracking-normal">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
