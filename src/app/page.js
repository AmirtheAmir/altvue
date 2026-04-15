"use client";

import { useState } from "react";
import AltvueMap from "./components/AltvueMap";
import FlightControlBillboard from "./components/organisms/FlightControlBillboard";
import {
  airportCatalog,
  durationOptionsMinutes,
} from "./db/routeDurationDatabase";

const noop = () => {};

export default function Home() {
  const [mode, setMode] = useState("pilot");

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dark-50 font-sans text-dark-0">
      <AltvueMap fromAirportCode={null} toAirportCode={null} />

      <div className="pointer-events-none absolute top-48 left-1/2 z-40 w-full -translate-x-1/2 px-4">
        <div className="pointer-events-auto">
          <FlightControlBillboard
            mode={mode}
            onModeChange={setMode}
            airports={airportCatalog}
            fromAirport={null}
            toAirport={null}
            onFromSelect={noop}
            onToSelect={noop}
            durationLabel={null}
            selectedDurationMinutes={null}
            durationOptionsMinutes={durationOptionsMinutes}
            onDurationSelect={noop}
            autopilotRoutes={[]}
            selectedAutopilotRouteId={null}
            onAutopilotRouteSelect={noop}
          />
        </div>
      </div>
    </main>
  );
}
