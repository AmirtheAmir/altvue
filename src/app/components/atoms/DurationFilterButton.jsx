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
      className={`shrink-0 rounded-md flex-1 py-1 font-XS-700 transition-all duration-300 hover:cursor-pointer ${
        active
          ? "bg-dark-0 text-dark-100"
          : "bg-crim-0 text-dark-600 hover:text-dark-900"
      }`}
    >
      {minutes} Min
    </button>
  );
}
