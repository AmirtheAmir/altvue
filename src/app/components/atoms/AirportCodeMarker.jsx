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
  const SelectedIcon = selectionType ? selectedMarkerConfig[selectionType] : null;

  return (
    <div
      className={`flex items-center justify-center gap-1 font-S-700 transition-all duration-300 ease-in-out hover:cursor-pointer ${
        SelectedIcon
          ? "rounded-md border-2 border-gold-500 bg-dark-100 px-2 py-1 text-gold-500"
          : isHovered
            ? "rounded-md bg-gold-500 px-2 py-1 text-dark-100"
            : "rounded-md bg-dark-200 px-2 py-1 text-dark-800"
      }`}
    >
      {SelectedIcon ? (
        <SelectedIcon aria-hidden="true" className="" />
      ) : null}
      {code}
    </div>
  );
}
