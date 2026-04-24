"use client";

export default function AirportCodeBadge({
  code,
  className = "",
  labelClassName = "font-S-700",
}) {
  if (!code) {
    return null;
  }

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-md bg-gold-500 px-2 py-1 text-dark-100 shadow-[0_0_16px_rgba(252,169,2,0.48)] ${className}`}
    >
      <span className={labelClassName}>{code}</span>
    </div>
  );
}
