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
  const [showFromError, setShowFromError] = useState(false);

  useEffect(() => {
    if (!showFromError) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowFromError(false);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [showFromError]);

  const handleBeforeTakeOffAnimation = () => {
    if (fromAirport) {
      setShowFromError(false);
      return true;
    }

    setShowFromError(true);
    return false;
  };

  const handleFromSelect = (airport) => {
    setShowFromError(false);
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
          isVisible={showFromError}
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
        <AirportSelectorInput
          cities={cities}
          type="to"
          referenceAirport={fromAirport}
          selectedAirport={toAirport}
          excludedCity={fromAirport?.city}
          onSelect={onToSelect}
        />

        <TakeOffButton
          className="mt-2"
          onBeforeAnimation={handleBeforeTakeOffAnimation}
          onClick={onTakeOff}
        />
      </div>
    </div>
  );
}
