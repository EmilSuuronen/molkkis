import React from "react";

// Finnish Flag (FI) - Simplified rounded blue cross on white
export function FlagFI({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", overflow: "hidden", display: "inline-block", verticalAlign: "middle" }}
    >
      <rect width="32" height="32" fill="#FFFFFF" />
      <rect x="8" width="6" height="32" fill="#003580" />
      <rect y="13" width="32" height="6" fill="#003580" />
    </svg>
  );
}

// Swedish Flag (SV) - Simplified rounded yellow cross on blue
export function FlagSV({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", overflow: "hidden", display: "inline-block", verticalAlign: "middle" }}
    >
      <rect width="32" height="32" fill="#006AA7" />
      <rect x="9" width="5" height="32" fill="#FECC00" />
      <rect y="13.5" width="32" height="5" fill="#FECC00" />
    </svg>
  );
}

// English / UK Flag (EN) - Simplified rounded Union Jack
export function FlagEN({ className = "", size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", overflow: "hidden", display: "inline-block", verticalAlign: "middle" }}
    >
      <rect width="32" height="32" fill="#00247D" />
      <path d="M0 0L32 32M32 0L0 32" stroke="#FFFFFF" strokeWidth="4.5" />
      <path d="M0 0L32 32M32 0L0 32" stroke="#CF142B" strokeWidth="2.5" />
      <rect x="12" width="8" height="32" fill="#FFFFFF" />
      <rect y="12" width="32" height="8" fill="#FFFFFF" />
      <rect x="13.5" width="5" height="32" fill="#CF142B" />
      <rect y="13.5" width="32" height="5" fill="#CF142B" />
    </svg>
  );
}

export function FlagIcon({ lang, size = 24, className = "" }) {
  switch (lang) {
    case "fi":
      return <FlagFI size={size} className={className} />;
    case "sv":
      return <FlagSV size={size} className={className} />;
    case "en":
    default:
      return <FlagEN size={size} className={className} />;
  }
}
