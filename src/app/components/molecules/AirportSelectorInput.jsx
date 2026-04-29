"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { cityDatabase } from "../../db/cityDatabase";
import { getFocusDurationByCities } from "../../db/focusDurationDatabase";
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
  referenceAirport,
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

  const [selectedMinutes, setSelectedMinutes] = useState(60);
  const marks = {
    0: "0",
    30: "30",
    60: "60",
    90: "90",
    120: "120",
  };

  const airportItems = useMemo(() => {
    return cityDatabase
      .filter((cityItem) => cityItem.city !== excludedCity)
      .flatMap((cityItem) =>
        cityItem.airports.map((airport) => {
          const focusDuration = getFocusDurationByCities(
            referenceAirport?.city,
            cityItem.city,
          );

          return {
            city: cityItem.city,
            country: cityItem.country,
            code: airport.code,
            coordinates: airport.coordinates,
            focusMinutes: focusDuration?.minutes ?? null,
          };
        }),
      );
  }, [excludedCity, referenceAirport?.city]);

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
        <div className="absolute ring-2 ring-dark-400 left-0 top-14 z-30 w-74 rounded-2xl bg-dark-200 p-2 shadow-[0_0_72px_rgba(0,0,0,0.56)">
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
                  focusMinutes={type === "to" ? airport.focusMinutes : null}
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
