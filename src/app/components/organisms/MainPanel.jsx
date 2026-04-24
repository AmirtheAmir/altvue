"use client";

import { useMemo, useState } from "react";
import PanelHeader from "../atoms/PanelHeader";
import TakeOffButton from "../atoms/TakeOffButton";
import ModeSwitch from "../molecules/ModeSwitch";
import AirportSelectorInput from "../molecules/AirportSelectorInput";

export default function MainPanel({
  fromAirport,
  toAirport,
  onFromSelect,
  onToSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("manual");

  const canShowDuration = useMemo(() => {
    return mode === "manual" && fromAirport && toAirport;
  }, [mode, fromAirport, toAirport]);

  return (
    <section
      className={`w-101 rounded-3xl flex flex-col gap-4  bg-[rgba(0,0,0,0.25)] p-3 shadow-[0_0_56px_rgba(0,0,0,0.72)] backdrop-blur-lg transition-all duration-300 ease-in-out ${
        isOpen ? "min-h-68" : "min-h-11"
      }`}
    >
      <PanelHeader isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />

      {isOpen && (
        <div className="flex flex-col gap-4">
          <ModeSwitch mode={mode} onChange={setMode} />

          {mode === "manual" ? (
            <div className="flex flex-col gap-2">
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
                <div className="flex items-center justify-between ">
                  <span className="font-XS-500 text-dark-900">
                    Duration of this flight is estimated to be
                  </span>
                  <span className="font-XS-700 text-dark-900">45:00</span>
                </div>
              )}

              <TakeOffButton className="mt-2" />
            </div>
          ) : (
            <div className="mt-5 rounded-[18px] border border-[#5F5F5F] px-4 py-6 text-center text-[16px] font-medium text-[#A5A5A5]">
              for now its empty
            </div>
          )}
        </div>
      )}
    </section>
  );
}
