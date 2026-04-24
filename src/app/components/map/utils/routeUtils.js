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

const getCoordinateDistance = (startCoordinates, endCoordinates) => {
  const [startLng, startLat] = startCoordinates;
  const [endLng, endLat] = endCoordinates;

  return Math.hypot(endLng - startLng, endLat - startLat);
};

export const getRouteCoordinateAtProgress = (coordinates, progress) => {
  if (!coordinates?.length) {
    return null;
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const segmentLengths = coordinates.slice(1).map((coordinate, index) => {
    return getCoordinateDistance(coordinates[index], coordinate);
  });
  const totalDistance = segmentLengths.reduce((total, length) => total + length, 0);

  if (!totalDistance) {
    return coordinates[0];
  }

  const targetDistance = totalDistance * clampedProgress;
  let traveledDistance = 0;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const segmentLength = segmentLengths[index];

    if (traveledDistance + segmentLength >= targetDistance) {
      const segmentProgress = (targetDistance - traveledDistance) / segmentLength;
      const [startLng, startLat] = coordinates[index];
      const [endLng, endLat] = coordinates[index + 1];

      return [
        startLng + (endLng - startLng) * segmentProgress,
        startLat + (endLat - startLat) * segmentProgress,
      ];
    }

    traveledDistance += segmentLength;
  }

  return coordinates[coordinates.length - 1];
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
