"use client";

import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  GpsFixedIcon,
  GpsNotFixedIcon,
  InstructionsIcon,
  MainIcon,
  MusicNoteOffIcon,
  MusicNoteOnIcon,
  NavigationIcon,
} from "@/assets/icons";
import Tooltip from "./Tooltip";

const iconButtonClassName =
  "flex items-center justify-center text-dark-0 transition-colors duration-300 ease-in-out hover:cursor-pointer hover:text-crim-200";

export default function PanelHeader({
  hasActiveFlight = false,
  isCompact = false,
  isFlightAudioMuted = false,
  isPlaneCameraLocked = true,
  isOpen,
  onCenterMap,
  onOpenInstructions,
  onToggleCompact,
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
        onClick={onToggleCompact}
        aria-label={isCompact ? "Show panel" : "Compact panel"}
        className="flex items-center gap-2 text-left text-dark-0 transition-all duration-300 ease-in-out hover:cursor-pointer"
      >
        <MainIcon aria-hidden="true" className="text-crim-800" />
        <span className="font-Brand text-dark-0">Altvue</span>
      </button>

      {!isCompact && (
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
              <Tooltip
                label={isFlightAudioMuted ? "Turn On Music" : "Turn Off Music"}
              >
                <button
                  type="button"
                  aria-label={
                    isFlightAudioMuted ? "Turn music on" : "Turn music off"
                  }
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
                  <NavigationIcon aria-hidden="true" />
                </button>
              </Tooltip>

              <Tooltip label="View Instructions">
                <button
                  type="button"
                  aria-label="Help"
                  className={iconButtonClassName}
                  onClick={onOpenInstructions}
                >
                  <InstructionsIcon aria-hidden="true" />
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
      )}
    </div>
  );
}
