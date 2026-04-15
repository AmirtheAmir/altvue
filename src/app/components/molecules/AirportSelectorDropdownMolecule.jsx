"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DropdownTriggerAtom from "../atoms/DropdownTriggerAtom";
import SearchInputAtom from "../atoms/SearchInputAtom";

export default function AirportSelectorDropdownMolecule({
  label,
  selectedAirport,
  airports,
  onSelect,
  blockedAirportCode = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredAirports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return airports.filter((airport) => {
      if (blockedAirportCode && airport.code === blockedAirportCode) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [airport.name, airport.city, airport.country, airport.code]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [airports, blockedAirportCode, query]);

  const selectedCode = selectedAirport?.code || null;

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <DropdownTriggerAtom
        leftText={selectedAirport ? selectedAirport.city : label}
        rightText={selectedCode}
        placeholder={!selectedAirport}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        showArrow={!selectedAirport || isOpen}
      />

      {isOpen ? (
        <div className="absolute top-[calc(100%+10px)] right-0 left-0 z-90 rounded-xl border-2 border-dark-700 bg-dark-50 p-2 shadow-[0_12px_28px_rgba(0,0,0,0.55)]">
          <SearchInputAtom value={query} onChange={setQuery} placeholder="Search" />

          <div className="mt-2 max-h-32 overflow-y-auto">
            {filteredAirports.length ? (
              filteredAirports.map((airport) => {
                const isCurrent = airport.code === selectedCode;

                return (
                  <button
                    key={airport.code}
                    type="button"
                    onClick={() => {
                      onSelect(airport);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex  p-2 w-full items-center justify-between text-left"
                  >
                    <span
                      className={`truncate font-M-700 ${
                        isCurrent ? "text-dark-0" : "text-dark-800"
                      }`}
                    >
                      {airport.city}
                    </span>

                    <span
                      className={` font-M-700 ${
                        isCurrent ? "text-dark-0" : "text-dark-800"
                      }`}
                    >
                      {airport.code}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="px-1 py-3 font-M-500 text-dark-800">No airports found.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
