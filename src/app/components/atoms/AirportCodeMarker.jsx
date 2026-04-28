import { FlightLand14Icon, FlightTakeoff14Icon } from "@/assets/icons";

const selectedMarkerConfig = {
  from: FlightTakeoff14Icon,
  to: FlightLand14Icon,
};

export default function AirportCodeMarker({
  code,
  isHovered = false,
  selectionType = null,
}) {
  const SelectedIcon = selectionType
    ? selectedMarkerConfig[selectionType]
    : null;

  return (
    <div
      className={`flex items-center justify-center px-2 py-1 gap-1 font-S-700 transition-all duration-300 ease-in-out hover:cursor-pointer ${
        SelectedIcon
          ? "rounded-md ring-2 ring-crim-500 bg-dark-200 text-crim-500"
          : isHovered
            ? "rounded-md bg-crim-32 ring-1 ring-crim-48 text-dark-600"
            : "rounded-md bg-dark-300 ring-1 ring-dark-400 text-dark-600"
      }`}
    >
      {SelectedIcon ? <SelectedIcon aria-hidden="true" className="" /> : null}
      {code}
    </div>
  );
}
