"use client";

export default function DurationFilterButton({
  active = false,
  minutes,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-md px-3 py-1.5 font-S-700 transition-colors duration-300 hover:cursor-pointer ${
        active
          ? "bg-dark-0 text-dark-100"
          : "bg-crim-0 text-crim-200 hover:bg-crim-48 hover:text-dark-0"
      }`}
    >
      {minutes} Min
    </button>
  );
}
