"use client";

import { useMemo, useState } from "react";
import TakeOffButton from "../atoms/TakeOffButton";
import AirportSelectorInput from "../molecules/AirportSelectorInput";
import ModeSwitch from "../molecules/ModeSwitch";

const formatFocusDuration = (minutes) => {
  return `${String(minutes).padStart(2, "0")}:00`;
};

export default function FlightChooserPanel({
  focusDuration,
  fromAirport,
  toAirport,
  onFromSelect,
  onTakeOff,
  onToSelect,
}) {
  const [mode, setMode] = useState("manual");

  const canShowDuration = useMemo(() => {
    return Boolean(mode === "manual" && focusDuration);
  }, [mode, focusDuration]);

  return (
    <div className="flex flex-col gap-4">
      <ModeSwitch mode={mode} onChange={setMode} />

      {mode === "manual" ? (
        <div className="flex flex-col gap-3">
          <AirportSelectorInput
            type="from"
            selectedAirport={fromAirport}
            excludedCity={toAirport?.city}
            onSelect={onFromSelect}
          />
          <AirportSelectorInput
            type="to"
            selectedAirport={toAirport}
            excludedCity={fromAirport?.city}
            onSelect={onToSelect}
          />

          {canShowDuration && (
            <div className="flex items-center justify-between">
              <span className="font-XS-500 text-dark-900">
                Duration of this flight is estimated to be
              </span>
              <span className="font-XS-700 text-dark-900">
                {formatFocusDuration(focusDuration.minutes)}
              </span>
            </div>
          )}

          <TakeOffButton
            className="mt-1"
            disabled={!fromAirport || !toAirport || !focusDuration}
            onClick={onTakeOff}
          />
        </div>
      ) : (
        <div className="mt-5 rounded-[18px] border border-[#5F5F5F] px-4 py-6 text-center text-[16px] font-medium text-[#A5A5A5]">
          for now its empty
        </div>
      )}
    </div>
  );
}
