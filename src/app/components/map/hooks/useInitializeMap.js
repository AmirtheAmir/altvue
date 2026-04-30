import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { INITIAL_CENTER, INITIAL_ZOOM, MAP_STYLE } from "../config/mapConfig";
import { syncRouteLayer } from "../layers/routeLayer";
import { applyBaseMapTheme } from "../theme/mapTheme";
import { createAirportMarkers } from "../utils/markerUtils";

const clearAirportMarkers = (markerEntries) => {
  markerEntries.forEach(({ cleanup }) => cleanup());
  markerEntries.clear();
};

// Creates the MapLibre map once, applies theme/markers/route, and cleans up on unmount.
export const useInitializeMap = ({
  cities,
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
    });

    return () => {
      clearAirportMarkers(markerEntries);
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

  useEffect(() => {
    const map = mapRef.current;
    const markerEntries = markerEntriesRef.current;

    if (!map) {
      return;
    }

    const syncAirportMarkers = () => {
      clearAirportMarkers(markerEntries);

      if (!cities.length) {
        return;
      }

      createAirportMarkers(
        cities,
        map,
        isFlightActiveRef,
        markerEntries,
        onAirportMarkerSelectRef,
        selectedMarkerTypesRef,
      );
    };

    if (!map.loaded()) {
      map.once("load", syncAirportMarkers);

      return () => {
        map.off("load", syncAirportMarkers);
      };
    }

    syncAirportMarkers();
  }, [
    cities,
    isFlightActiveRef,
    markerEntriesRef,
    mapRef,
    onAirportMarkerSelectRef,
    selectedMarkerTypesRef,
  ]);
};
