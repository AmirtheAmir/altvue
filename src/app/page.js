"use client";

import AltvueMap from "./components/AltvueMap";
import MainPanel from "./components/organisms/MainPanel";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dark-50 text-dark-0">
      <AltvueMap fromAirportCode={null} toAirportCode={null} />

      <div className="pointer-events-none absolute left-10 top-10 z-20 sm:left-6 sm:top-6">
        <div className="pointer-events-auto">
          <MainPanel />
        </div>
      </div>
    </main>
  );
}
