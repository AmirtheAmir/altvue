"use client";

import Lottie from "lottie-react";
import flightLoadingAnimation from "@/assets/lottie/flight-loading.json";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-dark-100 text-dark-0">
      <Lottie
        animationData={flightLoadingAnimation}
        aria-label="Preparing your world"
        className="h-36 w-36"
        loop
      />
      <p className="font-XS-700 text-crim-800">Alternative View</p>
    </div>
  );
}
