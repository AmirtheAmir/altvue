"use client";

export default function TakeOffButton({
  label = "Take Off",
  className = "",
  labelClassName = "font-S-700",
  disabled = false,
  ...props
}) {
  return (
    <button
      type="button"
      className={`w-full rounded-xl bg-gold-500 py-2 text-dark-100 transition-opacity duration-300 ease-in-out ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:cursor-pointer hover:opacity-90"
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className={labelClassName}>{label}</span>
    </button>
  );
}
