import {
  MusicNoteOffIcon,
  MusicNoteOnIcon,
  PauseIcon,
  PlayArrowIcon,
} from "@/assets/icons";
import FlightControlButton from "../atoms/FlightControlButton";

export default function ActiveFlightControls({
  activeFlight,
  isComplete,
  onCancel,
  onPause,
  onResume,
  onToggleMusic,
}) {
  const PauseToggleIcon = activeFlight.isPaused ? PlayArrowIcon : PauseIcon;
  const MusicToggleIcon = activeFlight.musicEnabled
    ? MusicNoteOnIcon
    : MusicNoteOffIcon;

  return (
    <div className="pt-3 grid grid-cols-3 items-center gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="font-S-700 p-3 rounded-xl text-dark-900 transition-all duration-300 ease-in-out hover:cursor-pointer hover:ring-2 hover:ring-dark-500"
      >
        Cancel
      </button>

      <FlightControlButton
        disabled={isComplete}
        icon={PauseToggleIcon}
        label={activeFlight.isPaused ? "Play" : "Pause"}
        onClick={activeFlight.isPaused ? onResume : onPause}
      />

      <FlightControlButton
        active={activeFlight.musicEnabled}
        icon={MusicToggleIcon}
        label={activeFlight.musicEnabled ? "On" : "Off"}
        onClick={onToggleMusic}
      />
    </div>
  );
}
