"use client";

import { useEffect, useMemo, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import AltvueMap from "./components/map/AltvueMap";
import MainPanel from "./components/organisms/MainPanel";
import { getFocusDurationByAirports } from "./db/focusDurationDatabase";
import { useFlightAudio } from "./hooks/useFlightAudio";
import {
  getFlightDurationMs,
  getFlightElapsedMs,
  getFlightRemainingMs,
} from "./utils/flightTiming";
import { fetchCities, getCityCenterByAirport } from "@/lib/citiesApi";

const MIN_LOADING_SCREEN_MS = 3500;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [hasTriedLoadingCities, setHasTriedLoadingCities] = useState(false);
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [focusedCoordinates, setFocusedCoordinates] = useState(null);
  const [flightPlan, setFlightPlan] = useState(null);
  const [mapResetRequest, setMapResetRequest] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFlightAudioMuted, setIsFlightAudioMuted] = useState(false);
  const [isPlaneCameraLocked, setIsPlaneCameraLocked] = useState(true);
  const {
    pauseFlightAudio,
    resumeFlightAudio,
    startFlightAudio,
    stopFlightAudio,
  } = useFlightAudio({
    isMuted: isFlightAudioMuted,
  });

  useEffect(() => {
    let isMounted = true;
    const minimumLoadingDelay = new Promise((resolve) => {
      window.setTimeout(resolve, MIN_LOADING_SCREEN_MS);
    });

    const loadCities = async () => {
      try {
        const nextCities = await fetchCities();
        await minimumLoadingDelay;

        if (isMounted) {
          setCities(nextCities);
        }
      } catch (error) {
        console.error("Failed to load cities", error);

        await minimumLoadingDelay;
      } finally {
        if (isMounted) {
          setHasTriedLoadingCities(true);
          setIsLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!flightPlan || flightPlan.isPaused) {
      return;
    }

    const remainingMs = getFlightRemainingMs(flightPlan);

    const completeFlight = () => {
      setFlightPlan(null);
      stopFlightAudio();
      setIsPlaneCameraLocked(true);
      setFromAirport(null);
      setToAirport(null);
      setFocusedCoordinates(null);
      setMapResetRequest((request) => request + 1);
    };

    if (remainingMs <= 0) {
      completeFlight();
      return;
    }

    const timeoutId = window.setTimeout(completeFlight, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [flightPlan, stopFlightAudio]);

  const focusDuration = useMemo(() => {
    return getFocusDurationByAirports(cities, fromAirport, toAirport);
  }, [cities, fromAirport, toAirport]);

  const handleFromSelect = (airport) => {
    setFlightPlan(null);
    setFromAirport(airport);
    setToAirport((currentToAirport) => {
      return currentToAirport?.city === airport.city ? null : currentToAirport;
    });
    setFocusedCoordinates(getCityCenterByAirport(cities, airport));
  };

  const handleToSelect = (airport) => {
    if (!fromAirport) {
      setToAirport(null);
      return;
    }

    setFlightPlan(null);
    setToAirport(airport);
    setFromAirport((currentFromAirport) => {
      return currentFromAirport?.city === airport.city
        ? null
        : currentFromAirport;
    });
    setFocusedCoordinates(getCityCenterByAirport(cities, airport));
  };

  const handleAirportMarkerSelect = (airport) => {
    setIsPanelOpen(true);

    if (fromAirport) {
      handleToSelect(airport);
      return;
    }

    handleFromSelect(airport);
  };

  const handleTakeOff = () => {
    if (
      !fromAirport?.coordinates ||
      !toAirport?.coordinates ||
      !focusDuration
    ) {
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
    setFromAirport(null);
    setToAirport(null);
    setFocusedCoordinates(null);
    setMapResetRequest((request) => request + 1);
  };

  const handleTogglePlaneCameraLock = () => {
    setIsPlaneCameraLocked((isLocked) => !isLocked);
  };

  const handleToggleFlightAudioMute = () => {
    setIsFlightAudioMuted((isMuted) => !isMuted);
  };

  const handleReloadPage = () => {
    window.location.reload();
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
    pauseFlightAudio();
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
    resumeFlightAudio();
  };

  const shouldShowCityLoadPopup =
    !isLoading && hasTriedLoadingCities && cities.length === 0;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dark-50 text-dark-0">
      {isLoading ? <LoadingScreen /> : null}
      {shouldShowCityLoadPopup ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-dark-100/70 px-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="city-load-popup-title"
            aria-describedby="city-load-popup-description"
            className="w-full max-w-sm rounded-2xl bg-crim-516 p-5 text-dark-0 shadow-[0_0_48px_rgba(0,0,0,0.64)] ring-2 ring-crim-048"
          >
            <h2 id="city-load-popup-title" className="font-S-700 text-lg">
              Cities did not load
            </h2>
            <p
              id="city-load-popup-description"
              className="mt-2 font-S-500 text-sm text-dark-900"
            >
              We could not load the airport city data. Please reload the page.
            </p>
            <button
              type="button"
              onClick={handleReloadPage}
              className="mt-5 w-full rounded-xl bg-crim-800 px-4 py-3 font-S-700 text-dark-0 transition hover:bg-crim-700 focus:outline-none focus:ring-2 focus:ring-dark-0"
            >
              Reload Page
            </button>
          </div>
        </div>
      ) : null}

      <AltvueMap
        cities={cities}
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
            cities={cities}
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
