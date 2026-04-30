import {
  ROUTE_LAYER_ID,
  ROUTE_LINE_COLOR,
  ROUTE_LINE_WIDTH,
  ROUTE_SOURCE_ID,
} from "../config/mapConfig";
import { isMapInstance } from "../utils/mapInstance";
import { getRouteData } from "../utils/routeUtils";

// Adds the GeoJSON source and line layer used to draw the selected route.
const addRouteLayer = (map, fromAirport, toAirport) => {
  if (!isMapInstance(map)) {
    return;
  }

  if (!map.getSource(ROUTE_SOURCE_ID)) {
    map.addSource(ROUTE_SOURCE_ID, {
      type: "geojson",
      data: getRouteData(fromAirport, toAirport),
    });
  }

  if (!map.getLayer(ROUTE_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": ROUTE_LINE_COLOR,
        "line-width": ROUTE_LINE_WIDTH,
      },
    });
  }
};

// Updates the existing route source with fresh GeoJSON data.
const updateRouteLayer = (map, fromAirport, toAirport) => {
  if (!isMapInstance(map)) {
    return;
  }

  const source = map.getSource(ROUTE_SOURCE_ID);

  if (source) {
    source.setData(getRouteData(fromAirport, toAirport));
  }
};

// Ensures the route layer exists, then updates it with the current selection.
export const syncRouteLayer = (map, fromAirport, toAirport) => {
  if (!isMapInstance(map)) {
    return;
  }

  if (!map.getSource(ROUTE_SOURCE_ID) || !map.getLayer(ROUTE_LAYER_ID)) {
    addRouteLayer(map, fromAirport, toAirport);
    return;
  }

  updateRouteLayer(map, fromAirport, toAirport);
};
