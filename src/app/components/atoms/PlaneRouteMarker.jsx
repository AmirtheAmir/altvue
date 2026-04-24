import { PlaneIcon } from "@/assets/icons";

export default function PlaneRouteMarker({ bearing = 0 }) {
  return (
    <div className="flex items-center justify-center ">
      <PlaneIcon
        aria-hidden="true"
        className="transition-transform duration-300 ease-in-out"
        style={{ transform: `rotate(${bearing}deg)` }}
      />
    </div>
  );
}
