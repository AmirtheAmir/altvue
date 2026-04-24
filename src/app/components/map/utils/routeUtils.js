import {
  ROUTE_CURVE_MAX_OFFSET,
  ROUTE_CURVE_SEGMENTS,
  ROUTE_CURVE_STRENGTH,
} from "../config/mapConfig";

// Empty GeoJSON returned when one or both airports are not selected.
const EMPTY_ROUTE_DATA = {
  type: "FeatureCollection",
  features: [],
};

// Builds a smooth curved coordinate list between two [longitude, latitude] points.
export const createCurvedRouteCoordinates = (startCoordinates, endCoordinates) => {
  const [startLng, startLat] = startCoordinates;
  let [endLng, endLat] = endCoordinates;
  const lngDelta = endLng - startLng;

  if (Math.abs(lngDelta) > 180) {
    endLng += lngDelta > 0 ? -360 : 360;
  }

  const adjustedLngDelta = endLng - startLng;
  const latDelta = endLat - startLat;
  const distance = Math.hypot(adjustedLngDelta, latDelta);

  if (!distance) {
    return [startCoordinates, endCoordinates];
  }

  const midpointLng = startLng + adjustedLngDelta / 2;
  const midpointLat = startLat + latDelta / 2;
  const curveOffset = Math.min(
    distance * ROUTE_CURVE_STRENGTH,
    ROUTE_CURVE_MAX_OFFSET,
  );
  const controlLng = midpointLng - (latDelta / distance) * curveOffset;
  const controlLat =
    midpointLat + Math.abs(adjustedLngDelta / distance) * curveOffset;

  return Array.from({ length: ROUTE_CURVE_SEGMENTS + 1 }, (_, index) => {
    const t = index / ROUTE_CURVE_SEGMENTS;
    const inverseT = 1 - t;
    const lng =
      inverseT * inverseT * startLng +
      2 * inverseT * t * controlLng +
      t * t * endLng;
    const lat =
      inverseT * inverseT * startLat +
      2 * inverseT * t * controlLat +
      t * t * endLat;

    return [lng, lat];
  });
};

// Converts selected from/to airports into the GeoJSON MapLibre expects.
export const getRouteData = (fromAirport, toAirport) => {
  if (!fromAirport?.coordinates || !toAirport?.coordinates) {
    return EMPTY_ROUTE_DATA;
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: createCurvedRouteCoordinates(
            fromAirport.coordinates,
            toAirport.coordinates,
          ),
        },
      },
    ],
  };
};
