"use client";

import TakeOffButton from "../atoms/TakeOffButton";
import AirportSelectorInput from "../molecules/AirportSelectorInput";

export default function FlightChooserPanel({
  fromAirport,
  toAirport,
  onFromSelect,
  onTakeOff,
  onToSelect,
}) {
  return (
    <div className="flex flex-col gap-4">
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

        <TakeOffButton
          className="mt-1"
          onClick={onTakeOff}
        />
      </div>
    </div>
  );
}
