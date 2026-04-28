"use client";

export default function AirportCodeChip({ code, icon: Icon, className = "" }) {
  return (
    <div
      className={`inline-flex self-start items-center gap-1 rounded-md border-2 border-crim-500 bg-transparent px-2 py-1 text-crim-500 transition-colors duration-300 group-hover:border-dark-100 group-hover:bg-crim-500 group-hover:text-dark-100  ${className}`}
    >
      {Icon ? <Icon aria-hidden="true" className="" /> : null}
      <span className="font-S-700">{code}</span>
    </div>
  );
}
