"use client";

import { useMemo, useState } from "react";
import AltvueMap from "./components/map/AltvueMap";
import MainPanel from "./components/organisms/MainPanel";
import { getCityCenterByAirport } from "./db/cityDatabase";
import { getFocusDurationByAirports } from "./db/focusDurationDatabase";

export default function Home() {
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [focusedCoordinates, setFocusedCoordinates] = useState(null);
  const [flightPlan, setFlightPlan] = useState(null);
  const focusDuration = useMemo(() => {
    return getFocusDurationByAirports(fromAirport, toAirport);
  }, [fromAirport, toAirport]);

  const handleFromSelect = (airport) => {
    setFlightPlan(null);
    setFromAirport(airport);
    setToAirport((currentToAirport) => {
      return currentToAirport?.city === airport.city ? null : currentToAirport;
    });
    setFocusedCoordinates(getCityCenterByAirport(airport));
  };

  const handleToSelect = (airport) => {
    setFlightPlan(null);
    setToAirport(airport);
    setFromAirport((currentFromAirport) => {
      return currentFromAirport?.city === airport.city ? null : currentFromAirport;
    });
    setFocusedCoordinates(getCityCenterByAirport(airport));
  };

  const handleTakeOff = () => {
    if (!fromAirport?.coordinates || !toAirport?.coordinates || !focusDuration) {
      return;
    }

    setFlightPlan((currentFlightPlan) => ({
      id: (currentFlightPlan?.id ?? 0) + 1,
      durationCategory: focusDuration.category,
      durationMinutes: focusDuration.minutes,
      fromAirport,
      toAirport,
    }));
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dark-50 text-dark-0">
      <AltvueMap
        focusedCoordinates={focusedCoordinates}
        flightPlan={flightPlan}
        fromAirport={fromAirport}
        toAirport={toAirport}
      />

      <div className="pointer-events-none absolute left-10 top-10 z-20 sm:left-6 sm:top-6">
        <div className="pointer-events-auto">
          <MainPanel
            focusDuration={focusDuration}
            fromAirport={fromAirport}
            toAirport={toAirport}
            onFromSelect={handleFromSelect}
            onTakeOff={handleTakeOff}
            onToSelect={handleToSelect}
          />
        </div>
      </div>
    </main>
  );
}
