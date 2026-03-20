import React from "react";

const DoubleHappiness = ({ size = 60, color = "#AF0E13", glow = false }) => {
  return (
    <div
      className="flex justify-center my-s10"
      style={{ 
        filter: glow ? `drop-shadow(0 0 5px ${color})` : "none"
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 25h25v10H20zm0 15h25v10H20zm5-25v35m15-35v35M20 65h25v10H20zm0 15h25v10H20zm5-25v35m15-35v35"
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M55 25h25v10H55zm0 15h25v10H55zm5-25v35m15-35v35M55 65h25v10H55zm0 15h25v10H55zm5-25v35m15-35v35"
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M45 45h10M45 75h10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default DoubleHappiness;
