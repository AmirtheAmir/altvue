import { FlightTakeoff16Icon } from "@/assets/icons";

export default function PlaneRouteMarker({ bearing = 0 }) {
  return (
    <div className="flex items-center justify-center ">
      <FlightTakeoff16Icon
        aria-hidden="true"
        className="transition-transform duration-300 ease-in-out"
        style={{ transform: `rotate(${bearing}deg)` }}
      />
    </div>
  );
}
