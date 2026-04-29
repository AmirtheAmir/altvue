"use client";

import AirportCard from "./AirportCard";

export default function FromOverlay({
  airportItems,
  cardIcon,
  onSelect,
  selectedAirport,
}) {
  return (
    <div className="absolute left-0 top-14 z-30 w-74 rounded-2xl bg-dark-200 p-2 shadow-[0_0_72px_rgba(0,0,0,0.56)] ring-2 ring-dark-400">
      <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto">
        {airportItems.map((airport) => {
          const isActive = selectedAirport?.code === airport.code;

          return (
            <AirportCard
              key={`${airport.city}-${airport.code}`}
              city={airport.city}
              country={airport.country}
              airportCode={airport.code}
              codeIcon={cardIcon}
              active={isActive}
              onClick={() => onSelect(airport)}
            />
          );
        })}
      </div>
    </div>
  );
}
