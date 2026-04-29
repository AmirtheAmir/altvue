"use client";

import PanelHeader from "../atoms/PanelHeader";
import ActiveFlightPanel from "./ActiveFlightPanel";
import FlightChooserPanel from "./FlightChooserPanel";

export default function MainPanel({
  activeFlight = null,
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
  const handleCancelFlight = () => {
    onOpenChange(true);
    onCancelFlight();
  };

  return (
    <section
      className={`flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-3xl bg-crim-516 p-3 shadow-[0_0_56px_rgba(0,0,0,0.72)] ring-2 ring-crim-048 backdrop-blur-lg transition-all duration-300 ease-in-out ${
        isOpen || activeFlight ? "min-h-0" : "min-h-11"
      }`}
    >
      <PanelHeader
        hasActiveFlight={Boolean(activeFlight)}
        isFlightAudioMuted={isFlightAudioMuted}
        isPlaneCameraLocked={isPlaneCameraLocked}
        isOpen={isOpen}
        onCenterMap={onCenterMap}
        onToggleFlightAudioMute={onToggleFlightAudioMute}
        onToggle={() => onOpenChange(!isOpen)}
        onTogglePlaneCameraLock={onTogglePlaneCameraLock}
      />

      {activeFlight ? (
        <ActiveFlightPanel
          activeFlight={activeFlight}
          isOpen={isOpen}
          onCancel={handleCancelFlight}
          onPause={onPauseFlight}
          onResume={onResumeFlight}
        />
      ) : isOpen ? (
        <FlightChooserPanel
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
