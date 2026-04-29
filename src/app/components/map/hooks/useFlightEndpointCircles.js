import { useEffect } from "react";
import { FLIGHT_ENDPOINT_SOURCE_ID } from "../config/mapConfig";
import { syncFlightEndpointLayer } from "../layers/flightEndpointLayer";

// Draws active flight start/end markers as MapLibre circle layers, not DOM
// markers, so they stay stable while the camera follows the plane.
export const useFlightEndpointCircles = ({ flightPlan, mapRef }) => {
  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (!map.loaded() && !map.getSource(FLIGHT_ENDPOINT_SOURCE_ID)) {
      map.once("load", () => syncFlightEndpointLayer(map, flightPlan));
      return;
    }

    syncFlightEndpointLayer(map, flightPlan);
  }, [flightPlan, mapRef]);
};
