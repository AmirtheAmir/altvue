import { PauseIcon, PlayArrowIcon } from "@/assets/icons";
import FlightControlButton from "../atoms/FlightControlButton";

export default function ActiveFlightControls({
  activeFlight,
  onCancel,
  onPause,
  onResume,
}) {
  const PauseToggleIcon = activeFlight.isPaused ? PlayArrowIcon : PauseIcon;

  return (
    <div className="pt-3 grid grid-cols-2 items-center gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="font-S-700 py-2.5 rounded-lg text-dark-900 transition-all duration-300 ease-in-out hover:cursor-pointer hover:ring-2 hover:ring-dark-600"
      >
        Cancel
      </button>

      <FlightControlButton
        icon={PauseToggleIcon}
        label={activeFlight.isPaused ? "Play" : "Pause"}
        onClick={activeFlight.isPaused ? onResume : onPause}
      />
    </div>
  );
}
