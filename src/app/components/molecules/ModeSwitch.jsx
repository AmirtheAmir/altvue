"use client";

import { AirplaneModeActiveIcon, ManualIcon } from "@/assets/icons";

export default function ModeSwitch({ mode, onChange }) {
  const isManual = mode === "manual";
  const isAutopilot = mode === "autopilot";

  return (
    <div className="grid w-full grid-cols-2 gap-1 rounded-xl border-2 border-dark-300 p-1">
      <button
        type="button"
        onClick={() => onChange("manual")}
        className={`flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out py-2.5 hover:cursor-pointer ${
          isManual ? "bg-dark-0 text-dark-100" : "bg-transparent text-dark-600"
        }`}
      >
        <ManualIcon aria-hidden="true" className="" />
        <span className="font-S-700">Manual</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("autopilot")}
        className={`flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out py-2.5 hover:cursor-pointer ${
          isAutopilot ? "bg-dark-0 text-dark-100" : "bg-transparent text-dark-600"
        }`}
      >
        <AirplaneModeActiveIcon aria-hidden="true" className="" />
        <span className="font-S-700">Autopilot</span>
      </button>
    </div>
  );
}
