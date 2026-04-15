"use client";

import { Airplane24, ArrowTo } from "../../../../public/icons";
import AirportSelectorDropdown from "../molecules/AirportSelectorDropdown";
import AutopilotTimerOption from "../molecules/AutopilotTimerOption";
import DurationSelector from "../molecules/DurationSelector";
import TakeOffButton from "../atoms/TakeOffButton";

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

export default function FlightControlBillboard({
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
    <article className="mx-auto w-full max-w-180 rounded-3xl border border-orange-500 bg-black p-4 text-dark-0 shadow-[0_0_24px_rgba(252,69,2,0.45)] flex-col flex gap-6">
      <div className="grid grid-cols-2 gap-1">
        {MODE_OPTIONS.map((modeOption) => {
          const isActive = modeOption.id === mode;

          return (
            <button
              key={modeOption.id}
              type="button"
              onClick={() => onModeChange(modeOption.id)}
              className={`rounded-xl font-S-500 p-3 transition-colors ${
                isActive
                  ? "bg-dark-200 text-dark-0"
                  : "text-dark-600 hover:text-dark-0 hover:cursor-pointer transition-colors duration-300"
              }`}
            >
              {modeOption.label}
            </button>
          );
        })}
      </div>

      {mode === "pilot" ? (
        <div className="">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[40px_minmax(0,1fr)_24px_minmax(0,1fr)_143px] md:items-center">
            <div className="flex  items-center justify-center text-orange-500">
              <Airplane24 className="" />
            </div>

            <AirportSelectorDropdown
              label="From"
              selectedAirport={fromAirport}
              airports={airports}
              blockedAirportCode={toAirport?.code || null}
              onSelect={onFromSelect}
            />

            <div className="hidden items-center justify-center text-dark-400 md:flex">
              <ArrowTo className="" />
            </div>

            <AirportSelectorDropdown
              label="To"
              selectedAirport={toAirport}
              airports={airports}
              blockedAirportCode={fromAirport?.code || null}
              onSelect={onToSelect}
            />

            <TakeOffButton className="ml-2" />
          </div>

          {durationLabel ? (
            <div className=" flex mt-4 items-center justify-center gap-5">
              <span className="font-S-500 text-dark-800">Duration</span>
              <span className="font-S-500 text-dark-800">{durationLabel}</span>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[40px_minmax(0,223.5px)_minmax(0,1fr)_143px] md:items-center">
            <div className="flex  items-center justify-center text-orange-500">
              <Airplane24 className="" />
            </div>

            <DurationSelector
              selectedMinutes={selectedDurationMinutes}
              optionsMinutes={durationOptionsMinutes}
              onSelect={onDurationSelect}
            />

            <p className="font-XS-500 pl-2 text-dark-950">
              Set your own focus time by entering a duration that works for you.
              Choose how long you want to stay focused, and we&apos;ll handle the
              rest.
            </p>

            <TakeOffButton className="ml-2" />
          </div>

          {hasDurationSelection ? (
            <div className="mt-4 max-h-44 flex-col gap-4 flex overflow-y-auto">
              {autopilotRoutes.length ? (
                autopilotRoutes.map((route) => (
                  <AutopilotTimerOption
                    key={route.id}
                    route={route}
                    checked={selectedAutopilotRouteId === route.id}
                    onSelect={() => onAutopilotRouteSelect(route.id)}
                  />
                ))
              ) : (
                <p className="font-M-500 text-dark-700">No routes for this timer value.</p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
