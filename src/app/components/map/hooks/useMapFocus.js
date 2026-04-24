import { useEffect } from "react";
import { MAP_FOCUS_DURATION } from "../config/mapConfig";

// Smoothly moves the map to the latest focused airport coordinates.
export const useMapFocus = ({ mapRef, focusedCoordinates }) => {
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !focusedCoordinates) {
      return;
    }

    const focusMap = () => {
      map.easeTo({
        center: focusedCoordinates,
        duration: MAP_FOCUS_DURATION,
        essential: true,
      });
    };

    if (!map.loaded()) {
      map.once("load", focusMap);
      return;
    }

    focusMap();
  }, [mapRef, focusedCoordinates]);
};
