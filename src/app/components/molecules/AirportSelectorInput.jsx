"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cityDatabase } from "../../db/cityDatabase";
import {
  FlightLand14Icon,
  FlightLand16Icon,
  FlightTakeoff14Icon,
  FlightTakeoff16Icon,
} from "@/assets/icons";
import AirportSelectorButton from "../atoms/AirportSelectorButton";
import AirportCard from "./AirportCard";

export default function AirportSelectorInput({
  type = "from",
  selectedAirport,
  excludedCity,
  onSelect,
  iconClassName,
  placeholderClassName,
  cityClassName,
  countryClassName,
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const containerRef = useRef(null);

  const inputIcon = type === "from" ? FlightTakeoff16Icon : FlightLand16Icon;
  const cardIcon = type === "from" ? FlightTakeoff14Icon : FlightLand14Icon;
  const placeholder = type === "from" ? "From" : "To";

  const airportItems = useMemo(() => {
    return cityDatabase
      .filter((cityItem) => cityItem.city !== excludedCity)
      .flatMap((cityItem) =>
        cityItem.airports.map((airport) => ({
          city: cityItem.city,
          country: cityItem.country,
          code: airport.code,
          coordinates: airport.coordinates,
        })),
      );
  }, [excludedCity]);

  const handleSelect = (airport) => {
    onSelect(airport);
    setIsPickerOpen(false);
  };

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isPickerOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsPickerOpen((prev) => !prev)}
        className="group w-full text-left hover:cursor-pointer"
      >
        <AirportSelectorButton
          icon={inputIcon}
          placeholder={placeholder}
          city={selectedAirport?.city}
          country={selectedAirport?.country}
          isSelected={Boolean(selectedAirport)}
          iconClassName={iconClassName}
          placeholderClassName={placeholderClassName}
          cityClassName={cityClassName}
          countryClassName={countryClassName}
        />
      </button>

      {isPickerOpen && (
        <div className="ring-2 ring-dark-400 absolute left-0 top-14 z-30 w-67 rounded-2xl bg-dark-200 p-2 shadow-[0_0_72px_rgba(0,0,0,0.56)]">
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
                  onClick={() => handleSelect(airport)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
