"use client";

import { useMemo, useState } from "react";
import AltvueMap from "./components/map/AltvueMap";
import MainPanel from "./components/organisms/MainPanel";
import { getCityCenterByAirport } from "./db/cityDatabase";
import { getFocusDurationByAirports } from "./db/focusDurationDatabase";
import { getFlightDurationMs, getFlightElapsedMs } from "./utils/flightTiming";

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

    const startedAt = Date.now();
    const durationMs = getFlightDurationMs(focusDuration.minutes);

    if (!durationMs) {
      return;
    }

    setFlightPlan((currentFlightPlan) => ({
      id: (currentFlightPlan?.id ?? 0) + 1,
      arrivalAt: startedAt + durationMs,
      departureAt: startedAt,
      durationCategory: focusDuration.category,
      durationMs,
      durationMinutes: focusDuration.minutes,
      elapsedBeforePauseMs: 0,
      fromAirport,
      isPaused: false,
      musicEnabled: true,
      resumedAt: startedAt,
      toAirport,
    }));
  };

  const handleCancelFlight = () => {
    setFlightPlan(null);
    setFromAirport(null);
    setToAirport(null);
    setFocusedCoordinates(null);
  };

  const handlePauseFlight = () => {
    const pausedAt = Date.now();

    setFlightPlan((currentFlightPlan) => {
      if (!currentFlightPlan || currentFlightPlan.isPaused) {
        return currentFlightPlan;
      }

      return {
        ...currentFlightPlan,
        elapsedBeforePauseMs: getFlightElapsedMs(currentFlightPlan, pausedAt),
        isPaused: true,
        pausedAt,
        resumedAt: null,
      };
    });
  };

  const handleResumeFlight = () => {
    const resumedAt = Date.now();

    setFlightPlan((currentFlightPlan) => {
      if (!currentFlightPlan || !currentFlightPlan.isPaused) {
        return currentFlightPlan;
      }

      return {
        ...currentFlightPlan,
        isPaused: false,
        pausedAt: null,
        resumedAt,
      };
    });
  };

  const handleToggleMusic = () => {
    setFlightPlan((currentFlightPlan) => {
      if (!currentFlightPlan) {
        return currentFlightPlan;
      }

      return {
        ...currentFlightPlan,
        musicEnabled: !currentFlightPlan.musicEnabled,
      };
    });
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
            activeFlight={flightPlan}
            focusDuration={focusDuration}
            fromAirport={fromAirport}
            onCancelFlight={handleCancelFlight}
            toAirport={toAirport}
            onFromSelect={handleFromSelect}
            onPauseFlight={handlePauseFlight}
            onResumeFlight={handleResumeFlight}
            onTakeOff={handleTakeOff}
            onToggleMusic={handleToggleMusic}
            onToSelect={handleToSelect}
          />
        </div>
      </div>
    </main>
  );
}
