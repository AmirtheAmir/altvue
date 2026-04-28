import FlightCountdown from "../atoms/FlightCountdown";
import FlightTimeBlock from "../atoms/FlightTimeBlock";
import FlightRouteProgress from "./FlightRouteProgress";

export default function ActiveFlightSummary({
  activeFlight,
  isOpen,
  remainingMs,
  routeProgress,
}) {
  const fromAirport = activeFlight.fromAirport;
  const toAirport = activeFlight.toAirport;

  if (!isOpen) {
    return (
      <div className="rounded-2xl ring-2 ring-dark-400 p-3">
        <FlightCountdown
          remainingMs={remainingMs}
          className="text-center font-S-700 text-dark-0"
        />
        <FlightRouteProgress
          compact
          fromCode={fromAirport.code}
          progress={routeProgress}
          toCode={toAirport.code}
        />
      </div>
    );
  }

  return (
    <>
      <FlightCountdown
        remainingMs={remainingMs}
        className="text-center font-S-700 text-dark-0"
      />

      <div className="">
        <FlightRouteProgress progress={routeProgress} />
      </div>

      <div className="flex  items-start justify-between">
        <div className="flex min-w-0 flex-col ">
          <span className="font-L-700 text-dark-0">{fromAirport.code}</span>
          <span className="font-XS-700 truncate text-dark-900">
            {fromAirport.city}
          </span>
        </div>

        <div className="flex min-w-0 flex-col items-end text-right">
          <span className="font-L-700 text-dark-0">{toAirport.code}</span>
          <span className="font-XS-700 truncate text-dark-900">
            {toAirport.city}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <FlightTimeBlock timestamp={activeFlight.departureAt} />
        <FlightTimeBlock align="right" timestamp={activeFlight.arrivalAt} />
      </div>
    </>
  );
}
