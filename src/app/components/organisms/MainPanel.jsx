"use client";

import { useState } from "react";
import PanelHeader from "../atoms/PanelHeader";
import ActiveFlightPanel from "./ActiveFlightPanel";
import FlightChooserPanel from "./FlightChooserPanel";

export default function MainPanel({
  activeFlight = null,
  cities = [],
  fromAirport,
  isFlightAudioMuted,
  isOpen,
  isPlaneCameraLocked,
  onCancelFlight,
  toAirport,
  onFromSelect,
  onCenterMap,
  onOpenChange,
  onPauseFlight,
  onResumeFlight,
  onTakeOff,
  onToSelect,
  onToggleFlightAudioMute,
  onTogglePlaneCameraLock,
}) {
  const [isCompact, setIsCompact] = useState(false);

  const handleCancelFlight = () => {
    onOpenChange(true);
    onCancelFlight();
  };

  const handleOpenChange = (nextIsOpen) => {
    setIsCompact(false);
    onOpenChange(nextIsOpen);
  };

  return (
    <section
      className={`flex max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-3xl bg-crim-516 shadow-[0_0_56px_rgba(0,0,0,0.72)] ring-2 ring-crim-048 backdrop-blur-lg transition-all duration-300 ease-in-out ${
        isCompact ? "py-3 pl-3 pr-4" : "p-3"
      } ${
        isCompact ? "w-auto" : "w-80"
      } ${
        isOpen || activeFlight ? "min-h-0" : "min-h-11"
      }`}
    >
      <PanelHeader
        hasActiveFlight={Boolean(activeFlight)}
        isCompact={isCompact}
        isFlightAudioMuted={isFlightAudioMuted}
        isPlaneCameraLocked={isPlaneCameraLocked}
        isOpen={isOpen}
        onCenterMap={onCenterMap}
        onToggleCompact={() => setIsCompact((current) => !current)}
        onToggleFlightAudioMute={onToggleFlightAudioMute}
        onToggle={() => handleOpenChange(!isOpen)}
        onTogglePlaneCameraLock={onTogglePlaneCameraLock}
      />

      {!isCompact && activeFlight ? (
        <ActiveFlightPanel
          activeFlight={activeFlight}
          isOpen={isOpen}
          onCancel={handleCancelFlight}
          onPause={onPauseFlight}
          onResume={onResumeFlight}
        />
      ) : !isCompact && isOpen ? (
        <FlightChooserPanel
          cities={cities}
          fromAirport={fromAirport}
          onFromSelect={onFromSelect}
          onTakeOff={onTakeOff}
          onToSelect={onToSelect}
          toAirport={toAirport}
        />
      ) : null}
    </section>
  );
}
