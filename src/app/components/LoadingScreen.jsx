"use client";

import Lottie from "lottie-react";
import flightLoadingAnimation from "@/assets/lottie/flight-loading.json";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center gap-3 justify-center bg-dark-100 text-dark-0">
      <Lottie
        animationData={flightLoadingAnimation}
        aria-label="Preparing your world"
        className="h-32 w-32"
        loop
      />
      <p className="font-S-700 text-crim-800">Preparing Your World</p>
    </div>
  );
}
