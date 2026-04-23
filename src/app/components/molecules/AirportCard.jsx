"use client";

import AirportCodeChip from "../atoms/AirportCodeChip";

export default function AirportCard({
  city,
  country,
  airportCode,
  codeIcon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col gap-1.5 rounded-lg bg-dark-300 p-1.5 text-left text-dark-0 transition-all duration-300 ease-in-out hover:bg-dark-0 hover:text-dark-100 hover:cursor-pointer"
    >
      <AirportCodeChip code={airportCode} icon={codeIcon} />

      <div className="flex flex-col gap-0.5">
        <div className="font-S-700">{city}</div>

        <div className="font-XS-500 text-dark-950 transition-colors duration-300 group-hover:text-dark-300">
          {country}
        </div>
      </div>
    </button>
  );
}
