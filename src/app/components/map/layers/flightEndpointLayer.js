import {
  FLIGHT_ENDPOINT_CIRCLE_COLOR,
  FLIGHT_ENDPOINT_CIRCLE_RADIUS,
  FLIGHT_ENDPOINT_CIRCLE_STROKE_COLOR,
  FLIGHT_ENDPOINT_CIRCLE_STROKE_WIDTH,
  FLIGHT_ENDPOINT_LAYER_ID,
  FLIGHT_ENDPOINT_SOURCE_ID,
} from "../config/mapConfig";
import { isMapInstance } from "../utils/mapInstance";

const EMPTY_ENDPOINT_DATA = {
  type: "FeatureCollection",
  features: [],
};

const getFlightEndpointData = (flightPlan) => {
  const fromCoordinates = flightPlan?.fromAirport?.coordinates;
  const toCoordinates = flightPlan?.toAirport?.coordinates;

  if (!fromCoordinates || !toCoordinates) {
    return EMPTY_ENDPOINT_DATA;
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { type: "from" },
        geometry: {
          type: "Point",
          coordinates: fromCoordinates,
        },
      },
      {
        type: "Feature",
        properties: { type: "to" },
        geometry: {
          type: "Point",
          coordinates: toCoordinates,
        },
      },
    ],
  };
};

const addFlightEndpointLayer = (map, flightPlan) => {
  if (!isMapInstance(map)) {
    return;
  }

  if (!map.getSource(FLIGHT_ENDPOINT_SOURCE_ID)) {
    map.addSource(FLIGHT_ENDPOINT_SOURCE_ID, {
      type: "geojson",
      data: getFlightEndpointData(flightPlan),
    });
  }

  if (!map.getLayer(FLIGHT_ENDPOINT_LAYER_ID)) {
    map.addLayer({
      id: FLIGHT_ENDPOINT_LAYER_ID,
      type: "circle",
      source: FLIGHT_ENDPOINT_SOURCE_ID,
      paint: {
        "circle-color": FLIGHT_ENDPOINT_CIRCLE_COLOR,
        "circle-radius": FLIGHT_ENDPOINT_CIRCLE_RADIUS,
        "circle-stroke-color": FLIGHT_ENDPOINT_CIRCLE_STROKE_COLOR,
        "circle-stroke-width": FLIGHT_ENDPOINT_CIRCLE_STROKE_WIDTH,
      },
    });
  }
};

const updateFlightEndpointLayer = (map, flightPlan) => {
  if (!isMapInstance(map)) {
    return;
  }

  const source = map.getSource(FLIGHT_ENDPOINT_SOURCE_ID);

  if (source) {
    source.setData(getFlightEndpointData(flightPlan));
  }
};

export const syncFlightEndpointLayer = (map, flightPlan) => {
  if (!isMapInstance(map)) {
    return;
  }

  if (
    !map.getSource(FLIGHT_ENDPOINT_SOURCE_ID) ||
    !map.getLayer(FLIGHT_ENDPOINT_LAYER_ID)
  ) {
    addFlightEndpointLayer(map, flightPlan);
    return;
  }

  updateFlightEndpointLayer(map, flightPlan);
};
