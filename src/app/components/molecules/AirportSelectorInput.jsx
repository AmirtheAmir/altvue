"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFocusDurationByCities } from "../../db/focusDurationDatabase";
import {
  FlightLand14Icon,
  FlightLand16Icon,
  FlightTakeoff14Icon,
  FlightTakeoff16Icon,
} from "@/assets/icons";
import AirportSelectorButton from "../atoms/AirportSelectorButton";
import FromOverlay from "./FromOverlay";
import ToOverlay from "./ToOverlay";

export default function AirportSelectorInput({
  cities = [],
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

  const airportItems = useMemo(() => {
    return cities
      .filter((cityItem) => cityItem.city !== excludedCity)
      .flatMap((cityItem) =>
        cityItem.airports.map((airport) => {
          const focusDuration = getFocusDurationByCities(
            cities,
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
  }, [cities, excludedCity, referenceAirport?.city]);

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

      {isPickerOpen && type === "from" ? (
        <FromOverlay
          airportItems={airportItems}
          cardIcon={cardIcon}
          onSelect={handleSelect}
          selectedAirport={selectedAirport}
        />
      ) : null}

      {isPickerOpen && type === "to" ? (
        <ToOverlay
          airportItems={airportItems}
          cardIcon={cardIcon}
          onSelect={handleSelect}
          selectedAirport={selectedAirport}
        />
      ) : null}
    </div>
  );
}
