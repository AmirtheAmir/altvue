export const MINUTE_IN_MS = 60000;
export const SECOND_IN_MS = 1000;
export const PANEL_PLANE_PROGRESS_STEP = 90000;

export const getFlightDurationMs = (durationMinutes) => {
  const minutes = Number(durationMinutes);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return null;
  }

  return minutes * MINUTE_IN_MS;
};

// Reads elapsed flight time from the session shape used by the panel and map.
export const getFlightElapsedMs = (flight, now = Date.now()) => {
  if (!flight?.durationMs) {
    return 0;
  }

  const savedElapsedMs = flight.elapsedBeforePauseMs ?? 0;

  if (flight.isPaused || !flight.resumedAt) {
    return Math.min(savedElapsedMs, flight.durationMs);
  }

  const liveElapsedMs = Math.max(now - flight.resumedAt, 0);

  return Math.min(savedElapsedMs + liveElapsedMs, flight.durationMs);
};

export const getFlightRemainingMs = (flight, now = Date.now()) => {
  if (!flight?.durationMs) {
    return 0;
  }

  return Math.max(flight.durationMs - getFlightElapsedMs(flight, now), 0);
};

export const getFlightProgress = (flight, now = Date.now()) => {
  if (!flight?.durationMs) {
    return 0;
  }

  return Math.min(getFlightElapsedMs(flight, now) / flight.durationMs, 1);
};

// The compact panel plane intentionally updates in larger 90-second steps.
export const getSteppedFlightProgress = (flight, now = Date.now()) => {
  if (!flight?.durationMs) {
    return 0;
  }

  const elapsedMs = getFlightElapsedMs(flight, now);

  if (elapsedMs >= flight.durationMs) {
    return 1;
  }

  const steppedElapsedMs =
    Math.floor(elapsedMs / PANEL_PLANE_PROGRESS_STEP) *
    PANEL_PLANE_PROGRESS_STEP;

  return Math.min(steppedElapsedMs / flight.durationMs, 1);
};
