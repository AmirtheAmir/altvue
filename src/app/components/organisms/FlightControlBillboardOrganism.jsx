"use client";

import { Airplane24, ArrowTo } from "../../../../public/icons";
import AirportSelectorDropdownMolecule from "../molecules/AirportSelectorDropdownMolecule";
import AutopilotRouteOptionMolecule from "../molecules/AutopilotRouteOptionMolecule";
import DurationSelectorMolecule from "../molecules/DurationSelectorMolecule";

const MODE_OPTIONS = [
  {
    id: "pilot",
    label: "Pilot Mode",
  },
  {
    id: "autopilot",
    label: "Autopilot",
  },
];

export default function FlightControlBillboardOrganism({
  mode,
  onModeChange,
  airports,
  fromAirport,
  toAirport,
  onFromSelect,
  onToSelect,
  durationLabel,
  selectedDurationMinutes,
  durationOptionsMinutes,
  onDurationSelect,
  autopilotRoutes,
  selectedAutopilotRouteId,
  onAutopilotRouteSelect,
}) {
  const hasDurationSelection = Number.isFinite(selectedDurationMinutes);

  return (
    <article className="mx-auto w-full max-w-[760px] rounded-[24px] border border-orange-500 bg-black px-3 py-3 text-dark-0 shadow-[0_0_24px_rgba(252,69,2,0.45)]">
      <div className="grid grid-cols-2 gap-2">
        {MODE_OPTIONS.map((modeOption) => {
          const isActive = modeOption.id === mode;

          return (
            <button
              key={modeOption.id}
              type="button"
              onClick={() => onModeChange(modeOption.id)}
              className={`h-10 rounded-[12px] font-M-700 transition-colors ${
                isActive
                  ? "bg-dark-200 text-dark-0"
                  : "text-dark-700 hover:text-dark-0"
              }`}
            >
              {modeOption.label}
            </button>
          );
        })}
      </div>

      {mode === "pilot" ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[24px_minmax(0,1fr)_20px_minmax(0,1fr)_132px] md:items-center">
            <div className="flex h-11 items-center justify-center text-orange-500">
              <Airplane24 className="" />
            </div>

            <AirportSelectorDropdownMolecule
              label="From"
              selectedAirport={fromAirport}
              airports={airports}
              blockedAirportCode={toAirport?.code || null}
              onSelect={onFromSelect}
            />

            <div className="hidden items-center justify-center text-dark-700 md:flex">
              <ArrowTo className="" />
            </div>

            <AirportSelectorDropdownMolecule
              label="To"
              selectedAirport={toAirport}
              airports={airports}
              blockedAirportCode={fromAirport?.code || null}
              onSelect={onToSelect}
            />

            <button
              type="button"
              className="h-11 rounded-[12px] bg-orange-500 px-5 font-L-700 text-dark-50"
            >
              Take Off
            </button>
          </div>

          {durationLabel ? (
            <div className="mt-6 flex items-center justify-center gap-8">
              <span className="font-L-500 text-dark-700">Duration</span>
              <span className="font-L-700 text-dark-800">{durationLabel}</span>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[24px_minmax(0,232px)_minmax(0,1fr)_132px] md:items-center">
            <div className="flex h-11 items-center justify-center text-orange-500">
              <Airplane24 className="" />
            </div>

            <DurationSelectorMolecule
              selectedMinutes={selectedDurationMinutes}
              optionsMinutes={durationOptionsMinutes}
              onSelect={onDurationSelect}
            />

            <p className="max-w-[290px] font-M-500 leading-[1.35] text-dark-0">
              Set your own focus time by entering a duration that works for you.
              Choose how long you want to stay focused, and we&apos;ll handle the
              rest.
            </p>

            <button
              type="button"
              className="h-11 rounded-[12px] bg-orange-500 px-5 font-L-700 text-dark-50"
            >
              Take Off
            </button>
          </div>

          {hasDurationSelection ? (
            <div className="mt-6 flex max-h-[220px] flex-col gap-4 overflow-y-auto pr-1">
              {autopilotRoutes.length ? (
                autopilotRoutes.map((route) => (
                  <AutopilotRouteOptionMolecule
                    key={route.id}
                    route={route}
                    checked={selectedAutopilotRouteId === route.id}
                    onSelect={() => onAutopilotRouteSelect(route.id)}
                  />
                ))
              ) : (
                <p className="font-L-500 text-dark-700">No routes for this timer value.</p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
