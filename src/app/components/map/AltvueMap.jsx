"use client";

import { useRef } from "react";
import { useInitializeMap } from "./hooks/useInitializeMap";
import { useMapFocus } from "./hooks/useMapFocus";
import { usePlaneRouteAnimation } from "./hooks/usePlaneRouteAnimation";
import { useRouteSync } from "./hooks/useRouteSync";
import { getSelectedMarkerTypes } from "./utils/markerUtils";

export default function AltvueMap({
  focusedCoordinates = null,
  flightPlan = null,
  fromAirport = null,
  toAirport = null,
}) {
  // DOM node passed to MapLibre as the map container.
  const mapContainerRef = useRef(null);

  // MapLibre map instance shared across map hooks.
  const mapRef = useRef(null);

  // Marker render/cleanup handlers keyed by airport code.
  const markerEntriesRef = useRef(new Map());

  // Latest selected marker types, used by marker render handlers.
  const selectedMarkerTypesRef = useRef(
    getSelectedMarkerTypes(fromAirport, toAirport),
  );

  // Latest route selection, read by the map load handler.
  const routeSelectionRef = useRef({ fromAirport, toAirport });

  useInitializeMap({
    mapContainerRef,
    mapRef,
    markerEntriesRef,
    selectedMarkerTypesRef,
    routeSelectionRef,
  });

  useRouteSync({
    mapRef,
    markerEntriesRef,
    routeSelectionRef,
    selectedMarkerTypesRef,
    fromAirport,
    toAirport,
  });

  useMapFocus({ mapRef, focusedCoordinates });
  usePlaneRouteAnimation({ mapRef, flightPlan });

  return (
    <section className="relative h-full w-full overflow-hidden bg-dark-50 z-0">
      <div ref={mapContainerRef} className="h-full w-full" />
    </section>
  );
}
