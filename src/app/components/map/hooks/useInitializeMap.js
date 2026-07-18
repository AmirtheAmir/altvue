import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { INITIAL_CENTER, INITIAL_ZOOM, MAP_STYLE } from "../config/mapConfig";
import { syncRouteLayer } from "../layers/routeLayer";
import { applyBaseMapTheme } from "../theme/mapTheme";
import { isMapInstance } from "../utils/mapInstance";
import { createAirportMarkers } from "../utils/markerUtils";

const MAP_UNAVAILABLE_MESSAGE =
  "The interactive map needs WebGL, but this browser could not create a WebGL context.";

const clearAirportMarkers = (markerEntries) => {
  markerEntries.forEach(({ cleanup }) => cleanup());
  markerEntries.clear();
};

const canCreateWebGLContext = () => {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
};

// Creates the MapLibre map once, applies theme/markers/route, and cleans up on unmount.
export const useInitializeMap = ({
  cities,
  isFlightActiveRef,
  mapContainerRef,
  mapRef,
  markerEntriesRef,
  onAirportMarkerSelectRef,
  onMapUnavailable,
  selectedMarkerTypesRef,
  routeSelectionRef,
}) => {
  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    const markerEntries = markerEntriesRef.current;
    const mapContainer = mapContainerRef.current;

    if (!mapContainer || !canCreateWebGLContext()) {
      onMapUnavailable?.(MAP_UNAVAILABLE_MESSAGE);
      return;
    }

    let map;

    try {
      map = new maplibregl.Map({
        container: mapContainer,
        style: MAP_STYLE,
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        attributionControl: false,
      });
    } catch (error) {
      console.error("Failed to initialize MapLibre", error);
      onMapUnavailable?.(MAP_UNAVAILABLE_MESSAGE);
      mapRef.current = null;
      return;
    }

    mapRef.current = map;
    onMapUnavailable?.(null);

    const handleMapLoad = () => {
      if (!isMapInstance(map)) {
        return;
      }

      const { fromAirport, toAirport } = routeSelectionRef.current;

      applyBaseMapTheme(map);
      syncRouteLayer(map, fromAirport, toAirport);
    };

    map.on("load", handleMapLoad);

    return () => {
      map.off("load", handleMapLoad);
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
    onMapUnavailable,
    selectedMarkerTypesRef,
    routeSelectionRef,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    const markerEntries = markerEntriesRef.current;

    if (!isMapInstance(map)) {
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
