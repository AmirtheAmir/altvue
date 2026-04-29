"use client";

import AirportCodeChip from "../atoms/AirportCodeChip";

export default function AirportCard({
  active = false,
  city,
  className = "w-full",
  country,
  airportCode,
  codeIcon,
  focusMinutes,
  onClick,
}) {
  const secondaryTextClassName =
    "text-dark-950 transition-colors duration-300 group-hover:text-dark-600";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col gap-1.5 rounded-xl bg-dark-300 p-2 text-left text-dark-0 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-dark-0 hover:text-dark-100 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 ${className}
        ${active ? "shadow-[inset_0_0_24px_#4f0d0fcc]" : ""}
      `}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="truncate font-S-700">{city}</div>
        <AirportCodeChip
          code={airportCode}
          icon={codeIcon}
          className="shrink-0 ring-crim-500 text-crim-500 group-hover:bg-crim-500 group-hover:text-dark-100 group-hover:ring-dark-100"
        />
      </div>

      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className={`truncate font-XS-500 ${secondaryTextClassName}`}>
          {country}
        </div>
        {focusMinutes && (
          <div className={`shrink-0 font-XS-700 ${secondaryTextClassName}`}>
            {focusMinutes} min
          </div>
        )}
      </div>
    </button>
  );
}
