"use client";

import { useState } from "react";
import PanelHeader from "../atoms/PanelHeader";
import ActiveFlightPanel from "./ActiveFlightPanel";
import FlightChooserPanel from "./FlightChooserPanel";

export default function MainPanel({
  activeFlight = null,
  fromAirport,
  onCancelFlight,
  toAirport,
  onFromSelect,
  onPauseFlight,
  onResumeFlight,
  onTakeOff,
  onToSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancelFlight = () => {
    setIsOpen(true);
    onCancelFlight();
  };

  return (
    <section
      className={`flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-3xl bg-crim-516 p-3 shadow-[0_0_56px_rgba(0,0,0,0.72)] backdrop-blur-lg transition-all duration-300 ease-in-out ${
        isOpen || activeFlight ? "min-h-0" : "min-h-11"
      }`}
    >
      <PanelHeader
        hasActiveFlight={Boolean(activeFlight)}
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
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
