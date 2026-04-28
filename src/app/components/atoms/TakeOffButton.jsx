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
      className={`w-full rounded-xl bg-crim-500 py-2.5 text-dark-100 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-crim-600 ${className}`}
      {...props}
    >
      <span className={labelClassName}>{label}</span>
    </button>
  );
}
