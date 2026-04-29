import { useEffect } from "react";
import { ROUTE_SOURCE_ID } from "../config/mapConfig";
import { syncRouteLayer } from "../layers/routeLayer";
import { getSelectedMarkerTypes } from "../utils/markerUtils";

// Keeps selected markers and the route line in sync with from/to airport changes.
export const useRouteSync = ({
  isFlightActive,
  isFlightActiveRef,
  mapRef,
  markerEntriesRef,
  routeSelectionRef,
  selectedMarkerTypesRef,
  fromAirport,
  toAirport,
}) => {
  useEffect(() => {
    const map = mapRef.current;

    routeSelectionRef.current = { fromAirport, toAirport };
    isFlightActiveRef.current = isFlightActive;
    selectedMarkerTypesRef.current = getSelectedMarkerTypes(
      fromAirport,
      toAirport,
    );
    markerEntriesRef.current.forEach(({ renderMarker }) => renderMarker());

    if (!map) {
      return;
    }

    if (!map.loaded() && !map.getSource(ROUTE_SOURCE_ID)) {
      map.once("load", () => syncRouteLayer(map, fromAirport, toAirport));
      return;
    }

    syncRouteLayer(map, fromAirport, toAirport);
  }, [
    mapRef,
    markerEntriesRef,
    isFlightActive,
    isFlightActiveRef,
    routeSelectionRef,
    selectedMarkerTypesRef,
    fromAirport,
    toAirport,
  ]);
};
