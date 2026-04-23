"use client";

export default function TakeOffButton({
  label = "Take Off",
  className = "",
  labelClassName = "font-S-700",
  ...props
}) {
  return (
    <button
      type="button"
      className={`w-full rounded-xl bg-gold-500 py-2 text-dark-100 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-90 ${className}`}
      {...props}
    >
      <span className={labelClassName}>{label}</span>
    </button>
  );
}
