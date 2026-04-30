"use client";

import { useEffect, useRef } from "react";
import { useFlightEndpointCircles } from "./hooks/useFlightEndpointCircles";
import { useInitializeMap } from "./hooks/useInitializeMap";
import { useMapFocus } from "./hooks/useMapFocus";
import { usePlaneRouteAnimation } from "./hooks/usePlaneRouteAnimation";
import { useRouteSync } from "./hooks/useRouteSync";
import {
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MAP_FOCUS_DURATION,
  PLANE_ROUTE_OVERLAY_SIZE,
} from "./config/mapConfig";
import { getSelectedMarkerTypes } from "./utils/markerUtils";

export default function AltvueMap({
  cities = [],
  focusedCoordinates = null,
  followPlane = false,
  flightPlan = null,
  fromAirport = null,
  onAirportMarkerSelect,
  resetViewRequest = 0,
  toAirport = null,
}) {
  // DOM node passed to MapLibre as the map container.
  const mapContainerRef = useRef(null);

  // MapLibre map instance shared across map hooks.
  const mapRef = useRef(null);

  // Fixed center plane used while the camera is locked to the flight.
  const planeOverlayRef = useRef(null);

  // Marker render/cleanup handlers keyed by airport code.
  const markerEntriesRef = useRef(new Map());

  // Latest marker selection handler, used by markers created once on map load.
  const onAirportMarkerSelectRef = useRef(onAirportMarkerSelect);

  // Latest selected marker types, used by marker render handlers.
  const selectedMarkerTypesRef = useRef(
    getSelectedMarkerTypes(fromAirport, toAirport),
  );

  // Latest active-flight marker mode, read by marker render handlers.
  const isFlightActiveRef = useRef(Boolean(flightPlan));

  // Latest route selection, read by the map load handler.
  const routeSelectionRef = useRef({ fromAirport, toAirport });

  useEffect(() => {
    onAirportMarkerSelectRef.current = onAirportMarkerSelect;
  }, [onAirportMarkerSelect]);

  useInitializeMap({
    cities,
    isFlightActiveRef,
    mapContainerRef,
    mapRef,
    markerEntriesRef,
    onAirportMarkerSelectRef,
    selectedMarkerTypesRef,
    routeSelectionRef,
  });

  useRouteSync({
    isFlightActive: Boolean(flightPlan),
    isFlightActiveRef,
    mapRef,
    markerEntriesRef,
    routeSelectionRef,
    selectedMarkerTypesRef,
    fromAirport,
    toAirport,
  });

  useMapFocus({ mapRef, focusedCoordinates });
  useFlightEndpointCircles({ flightPlan, mapRef });
  usePlaneRouteAnimation({ followPlane, flightPlan, mapRef, planeOverlayRef });

  useEffect(() => {
    const map = mapRef.current;

    if (!map || resetViewRequest === 0) {
      return;
    }

    map.stop();
    map.easeTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      duration: MAP_FOCUS_DURATION,
      essential: true,
    });
  }, [resetViewRequest]);

  return (
    <section className="relative h-full w-full overflow-hidden bg-dark-50 z-0">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div
        ref={planeOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-10"
        style={{
          display: "none",
          height: PLANE_ROUTE_OVERLAY_SIZE,
          transform: "translate(-50%, -50%)",
          width: PLANE_ROUTE_OVERLAY_SIZE,
        }}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.9283 18.7509L28.4535 16.4664L17.5572 12.7733L16.2513 6.49092C16.0542 5.54285 15.1299 4.93662 14.1818 5.13369C13.2337 5.33075 12.6275 6.25514 12.8246 7.20321L14.1304 13.4856L5.60842 21.215L6.08327 23.4995L15.1988 18.6257L16.5047 24.9081L14.0052 27.2151L14.3614 28.9284L18.6929 26.8365L23.4994 27.029L23.1432 25.3156L19.9315 24.1958L18.6256 17.9134L28.9283 18.7509Z"
            fill="#DC252B"
          />
        </svg>
      </div>
    </section>
  );
}
