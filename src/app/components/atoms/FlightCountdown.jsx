import { SECOND_IN_MS } from "../../utils/flightTiming";

const formatCountdown = (remainingMs) => {
  const totalSeconds = Math.ceil(remainingMs / SECOND_IN_MS);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function FlightCountdown({ remainingMs, className = "" }) {
  return <div className={className}>{formatCountdown(remainingMs)}</div>;
}
