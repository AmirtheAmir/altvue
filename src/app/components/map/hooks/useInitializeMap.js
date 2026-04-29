import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { INITIAL_CENTER, INITIAL_ZOOM, MAP_STYLE } from "../config/mapConfig";
import { syncRouteLayer } from "../layers/routeLayer";
import { applyBaseMapTheme } from "../theme/mapTheme";
import { createAirportMarkers } from "../utils/markerUtils";

// Creates the MapLibre map once, applies theme/markers/route, and cleans up on unmount.
export const useInitializeMap = ({
  isFlightActiveRef,
  mapContainerRef,
  mapRef,
  markerEntriesRef,
  onAirportMarkerSelectRef,
  selectedMarkerTypesRef,
  routeSelectionRef,
}) => {
  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    const markerEntries = markerEntriesRef.current;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      const { fromAirport, toAirport } = routeSelectionRef.current;

      applyBaseMapTheme(map);
      syncRouteLayer(map, fromAirport, toAirport);
      createAirportMarkers(
        map,
        isFlightActiveRef,
        markerEntries,
        onAirportMarkerSelectRef,
        selectedMarkerTypesRef,
      );
    });

    return () => {
      markerEntries.forEach(({ cleanup }) => cleanup());
      markerEntries.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [
    mapContainerRef,
    mapRef,
    isFlightActiveRef,
    markerEntriesRef,
    onAirportMarkerSelectRef,
    selectedMarkerTypesRef,
    routeSelectionRef,
  ]);
};
