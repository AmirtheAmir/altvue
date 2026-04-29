"use client";

import { useMemo, useState } from "react";
import AltvueMap from "./components/map/AltvueMap";
import MainPanel from "./components/organisms/MainPanel";
import { getCityCenterByAirport } from "./db/cityDatabase";
import { getFocusDurationByAirports } from "./db/focusDurationDatabase";
import { useFlightAudio } from "./hooks/useFlightAudio";
import { getFlightDurationMs, getFlightElapsedMs } from "./utils/flightTiming";

export default function Home() {
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [focusedCoordinates, setFocusedCoordinates] = useState(null);
  const [flightPlan, setFlightPlan] = useState(null);
  const [mapResetRequest, setMapResetRequest] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFlightAudioMuted, setIsFlightAudioMuted] = useState(false);
  const [isPlaneCameraLocked, setIsPlaneCameraLocked] = useState(true);
  const { startFlightAudio, stopFlightAudio } = useFlightAudio({
    isMuted: isFlightAudioMuted,
  });
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

  const handleAirportMarkerSelect = (airport) => {
    setIsPanelOpen(true);

    if (fromAirport || toAirport) {
      handleToSelect(airport);
      return;
    }

    handleFromSelect(airport);
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

    startFlightAudio(durationMs);
    setIsPlaneCameraLocked(true);
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
      resumedAt: startedAt,
      toAirport,
    }));
  };

  const handleCancelFlight = () => {
    setFlightPlan(null);
    stopFlightAudio();
    setIsPlaneCameraLocked(true);
    setFromAirport(null);
    setToAirport(null);
    setFocusedCoordinates(null);
  };

  const handleCenterMap = () => {
    setMapResetRequest((request) => request + 1);
  };

  const handleTogglePlaneCameraLock = () => {
    setIsPlaneCameraLocked((isLocked) => !isLocked);
  };

  const handleToggleFlightAudioMute = () => {
    setIsFlightAudioMuted((isMuted) => !isMuted);
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

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dark-50 text-dark-0">
      <AltvueMap
        focusedCoordinates={focusedCoordinates}
        followPlane={Boolean(flightPlan) && isPlaneCameraLocked}
        flightPlan={flightPlan}
        fromAirport={fromAirport}
        onAirportMarkerSelect={handleAirportMarkerSelect}
        resetViewRequest={mapResetRequest}
        toAirport={toAirport}
      />

      <div className="pointer-events-none absolute left-14 top-14 z-20 sm:left-6 sm:top-6">
        <div className="pointer-events-auto">
          <MainPanel
            activeFlight={flightPlan}
            fromAirport={fromAirport}
            isFlightAudioMuted={isFlightAudioMuted}
            isOpen={isPanelOpen}
            isPlaneCameraLocked={isPlaneCameraLocked}
            onCancelFlight={handleCancelFlight}
            onCenterMap={handleCenterMap}
            toAirport={toAirport}
            onFromSelect={handleFromSelect}
            onOpenChange={setIsPanelOpen}
            onPauseFlight={handlePauseFlight}
            onResumeFlight={handleResumeFlight}
            onTakeOff={handleTakeOff}
            onToSelect={handleToSelect}
            onToggleFlightAudioMute={handleToggleFlightAudioMute}
            onTogglePlaneCameraLock={handleTogglePlaneCameraLock}
          />
        </div>
      </div>
    </main>
  );
}
