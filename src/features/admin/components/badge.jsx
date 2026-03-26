import React from "react";

export const Badge = ({ children, color = "blue" }) => {
  const map = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-600",
    pink: "bg-pink-100 text-pink-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[color] || map.gray}`}
    >
      {children}
    </span>
  );
};
