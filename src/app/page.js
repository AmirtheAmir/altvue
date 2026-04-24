"use client";

import { useState } from "react";
import AltvueMap from "./components/map/AltvueMap";
import MainPanel from "./components/organisms/MainPanel";
import { getCityCenterByAirport } from "./db/cityDatabase";

export default function Home() {
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [focusedCoordinates, setFocusedCoordinates] = useState(null);

  const handleFromSelect = (airport) => {
    setFromAirport(airport);
    setToAirport((currentToAirport) => {
      return currentToAirport?.city === airport.city ? null : currentToAirport;
    });
    setFocusedCoordinates(getCityCenterByAirport(airport));
  };

  const handleToSelect = (airport) => {
    setToAirport(airport);
    setFromAirport((currentFromAirport) => {
      return currentFromAirport?.city === airport.city ? null : currentFromAirport;
    });
    setFocusedCoordinates(getCityCenterByAirport(airport));
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dark-50 text-dark-0">
      <AltvueMap
        focusedCoordinates={focusedCoordinates}
        fromAirport={fromAirport}
        toAirport={toAirport}
      />

      <div className="pointer-events-none absolute left-10 top-10 z-20 sm:left-6 sm:top-6">
        <div className="pointer-events-auto">
          <MainPanel
            fromAirport={fromAirport}
            toAirport={toAirport}
            onFromSelect={handleFromSelect}
            onToSelect={handleToSelect}
          />
        </div>
      </div>
    </main>
  );
}
