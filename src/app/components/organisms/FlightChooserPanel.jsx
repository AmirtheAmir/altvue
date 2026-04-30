"use client";

import { useEffect, useState } from "react";
import TakeOffButton from "../atoms/TakeOffButton";
import Tooltip from "../atoms/Tooltip";
import AirportSelectorInput from "../molecules/AirportSelectorInput";

export default function FlightChooserPanel({
  cities = [],
  fromAirport,
  toAirport,
  onFromSelect,
  onTakeOff,
  onToSelect,
}) {
  const [departureErrorTarget, setDepartureErrorTarget] = useState(null);
  const isToSelectorDisabled = !fromAirport;

  useEffect(() => {
    if (!departureErrorTarget) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDepartureErrorTarget(null);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [departureErrorTarget]);

  const handleBeforeTakeOffAnimation = () => {
    if (fromAirport) {
      setDepartureErrorTarget(null);
      return true;
    }

    setDepartureErrorTarget("from");
    return false;
  };

  const handleFromSelect = (airport) => {
    setDepartureErrorTarget(null);
    onFromSelect(airport);
  };

  return (
    <div className="flex flex-col gap-4">
        <div className="font-S-500 text-dark-900">
          Select your departure and destination to begin your focus journey. Once you are ready, Take off.
        </div>
      <div className="flex flex-col gap-3">
        <Tooltip
          className="z-20 w-full"
          isVisible={departureErrorTarget === "from"}
          label="First, Select Departure Location Pls"
          position="bottom"
          showOnHover={false}
          variant="error"
        >
          <AirportSelectorInput
            cities={cities}
            type="from"
            referenceAirport={toAirport}
            selectedAirport={fromAirport}
            excludedCity={toAirport?.city}
            onSelect={handleFromSelect}
          />
        </Tooltip>
        <Tooltip
          className="z-10 w-full"
          isVisible={departureErrorTarget === "to"}
          label="First, Select Departure Location Pls"
          position="bottom"
          showOnHover={false}
          variant="error"
        >
          <AirportSelectorInput
            cities={cities}
            disabled={isToSelectorDisabled}
            type="to"
            referenceAirport={fromAirport}
            selectedAirport={toAirport}
            excludedCity={fromAirport?.city}
            onDisabledClick={() => setDepartureErrorTarget("to")}
            onSelect={onToSelect}
          />
        </Tooltip>

        <TakeOffButton
          className="mt-2"
          onBeforeAnimation={handleBeforeTakeOffAnimation}
          onClick={onTakeOff}
        />
      </div>
    </div>
  );
}
