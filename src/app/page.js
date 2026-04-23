"use client";

import AltvueMap from "./components/AltvueMap";

export default function Home() {

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-dark-50 text-dark-0">
      <AltvueMap fromAirportCode={null} toAirportCode={null} />
    </main>
  );
}
