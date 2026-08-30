import React from "react";

export function TrustWardMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 2L5 8V18C5 26.5 10.5 31.8 18 34C25.5 31.8 31 26.5 31 18V8L18 2Z"
        fill="url(#trustward-grad)"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18 10L23 15L18 20L13 15L18 10Z"
        fill="#fbbf24"
      />
      <path
        d="M18 20V27M13 24H23"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="trustward-grad" x1="5" y1="2" x2="31" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" />
          <stop offset="0.5" stopColor="#b45309" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
