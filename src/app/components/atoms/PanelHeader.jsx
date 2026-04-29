"use client";

import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  CenterIcon,
  GpsFixedIcon,
  GpsNotFixedIcon,
  HelpIcon,
  MusicNoteOffIcon,
  MusicNoteOnIcon,
} from "@/assets/icons";
import Tooltip from "./Tooltip";

const iconButtonClassName =
  "flex items-center justify-center text-dark-0 transition-colors duration-300 ease-in-out hover:cursor-pointer hover:text-crim-200";

export default function PanelHeader({
  hasActiveFlight = false,
  isFlightAudioMuted = false,
  isPlaneCameraLocked = true,
  isOpen,
  onCenterMap,
  onToggleFlightAudioMute,
  onTogglePlaneCameraLock,
  onToggle,
}) {
  const MusicIcon = isFlightAudioMuted ? MusicNoteOffIcon : MusicNoteOnIcon;
  const GpsIcon = isPlaneCameraLocked ? GpsFixedIcon : GpsNotFixedIcon;
  const DropdownIcon = isOpen ? ArrowDropUpIcon : ArrowDropDownIcon;

  return (
    <div className="flex w-full items-center justify-between">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 text-left transition-all duration-300 ease-in-out hover:cursor-pointer"
      >
        <span className="font-S-700 text-dark-0">ALTVUE</span>
      </button>

      <div className="flex items-center gap-4">
        {hasActiveFlight ? (
          <>
            <Tooltip label={isPlaneCameraLocked ? "Free Camera" : "Lock View"}>
              <button
                type="button"
                aria-label={isPlaneCameraLocked ? "Free camera" : "Lock view"}
                aria-pressed={isPlaneCameraLocked}
                className={iconButtonClassName}
                onClick={onTogglePlaneCameraLock}
              >
                <GpsIcon aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip label={isFlightAudioMuted ? "Turn On Music" : "Turn Off Music"}>
              <button
                type="button"
                aria-label={isFlightAudioMuted ? "Turn music on" : "Turn music off"}
                aria-pressed={!isFlightAudioMuted}
                className={iconButtonClassName}
                onClick={onToggleFlightAudioMute}
              >
                <MusicIcon aria-hidden="true" />
              </button>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip label="Center Map">
              <button
                type="button"
                aria-label="Center map"
                className={iconButtonClassName}
                onClick={onCenterMap}
              >
                <CenterIcon aria-hidden="true" />
              </button>
            </Tooltip>

            <Tooltip label="View Instructions">
              <button
                type="button"
                aria-label="Help"
                className={iconButtonClassName}
              >
                <HelpIcon aria-hidden="true" />
              </button>
            </Tooltip>
          </>
        )}

        <button
          type="button"
          aria-label={isOpen ? "Collapse panel" : "Expand panel"}
          className={iconButtonClassName}
          onClick={onToggle}
        >
          <DropdownIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
