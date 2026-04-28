"use client";

import { useState } from "react";
import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  GpsFixedIcon,
  GpsNotFixedIcon,
  HelpIcon,
  MusicNoteOffIcon,
  MusicNoteOnIcon,
} from "@/assets/icons";
import Tooltip from "./Tooltip";

const iconButtonClassName =
  "flex items-center justify-center text-dark-0 transition-colors duration-300 ease-in-out hover:cursor-pointer hover:text-crim-200";

export default function PanelHeader({ hasActiveFlight = false, isOpen, onToggle }) {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isGpsFixed, setIsGpsFixed] = useState(true);

  const MusicIcon = isMusicEnabled ? MusicNoteOnIcon : MusicNoteOffIcon;
  const GpsIcon = isGpsFixed ? GpsFixedIcon : GpsNotFixedIcon;
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
            <Tooltip label={isGpsFixed ? "Free Camera" : "Lock View"}>
              <button
                type="button"
                aria-label={isGpsFixed ? "Free camera" : "Lock view"}
                aria-pressed={isGpsFixed}
                className={iconButtonClassName}
                onClick={() => setIsGpsFixed((current) => !current)}
              >
                <GpsIcon aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip
              label={isMusicEnabled ? "Turn Off Music" : "Turn On Music"}
            >
              <button
                type="button"
                aria-label={isMusicEnabled ? "Turn music off" : "Turn music on"}
                aria-pressed={isMusicEnabled}
                className={iconButtonClassName}
                onClick={() => setIsMusicEnabled((current) => !current)}
              >
                <MusicIcon aria-hidden="true" />
              </button>
            </Tooltip>
          </>
        ) : (
          <Tooltip label="View Instructions">
            <button type="button" aria-label="Help" className={iconButtonClassName}>
              <HelpIcon aria-hidden="true" />
            </button>
          </Tooltip>
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
