"use client";

import { useEffect, useState } from "react";
import ActiveFlightControls from "../molecules/ActiveFlightControls";
import ActiveFlightSummary from "../molecules/ActiveFlightSummary";
import {
  getFlightRemainingMs,
  getSteppedFlightProgress,
  SECOND_IN_MS,
} from "../../utils/flightTiming";

const useFlightClock = (activeFlight) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!activeFlight) {
      return;
    }

    let intervalId = null;

    const updateClock = () => {
      const nextNow = Date.now();

      setNow(nextNow);

      if (intervalId && getFlightRemainingMs(activeFlight, nextNow) <= 0) {
        window.clearInterval(intervalId);
      }
    };
    const timeoutId = window.setTimeout(updateClock, 0);

    if (activeFlight.isPaused) {
      return () => window.clearTimeout(timeoutId);
    }

    intervalId = window.setInterval(updateClock, SECOND_IN_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [activeFlight]);

  return now;
};

// Replaces the picker UI after takeoff and keeps flight controls close to status.
export default function ActiveFlightPanel({
  activeFlight,
  isOpen,
  onCancel,
  onPause,
  onResume,
  onToggleMusic,
}) {
  const now = useFlightClock(activeFlight);
  const remainingMs = getFlightRemainingMs(activeFlight, now);
  // This plane intentionally moves in 90-second steps, separate from the map plane.
  const routeProgress = getSteppedFlightProgress(activeFlight, now);
  const isComplete = remainingMs <= 0;

  if (!isOpen) {
    return (
      <ActiveFlightSummary
        activeFlight={activeFlight}
        isOpen={isOpen}
        remainingMs={remainingMs}
        routeProgress={routeProgress}
      />
    );
  }

  return (
    <div className="rounded-2xl ring-2 ring-dark-400 p-3">
      <ActiveFlightSummary
        activeFlight={activeFlight}
        isOpen={isOpen}
        remainingMs={remainingMs}
        routeProgress={routeProgress}
      />
      <ActiveFlightControls
        activeFlight={activeFlight}
        isComplete={isComplete}
        onCancel={onCancel}
        onPause={onPause}
        onResume={onResume}
        onToggleMusic={onToggleMusic}
      />
    </div>
  );
}
