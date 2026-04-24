// URL of the MapLibre style used to render the base map.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

// Initial map center passed to MapLibre as [longitude, latitude].
export const INITIAL_CENTER = [-40, 43];

// Initial zoom level passed to MapLibre when the map is created.
export const INITIAL_ZOOM = 2.2;

// Animation duration in milliseconds when focusing a selected airport.
export const MAP_FOCUS_DURATION = 1200;

// GeoJSON source ID used by MapLibre for the selected route line.
export const ROUTE_SOURCE_ID = "selected-airport-route";

// Layer ID used by MapLibre to draw the selected route line.
export const ROUTE_LAYER_ID = "selected-airport-route-line";

// Route line color, matching the dark-800 design token.
export const ROUTE_LINE_COLOR = "#999999";

// Route line width in pixels.
export const ROUTE_LINE_WIDTH = 2;

// Curve strength used when calculating the route control point.
export const ROUTE_CURVE_STRENGTH = 0.2;

// Maximum geographic offset applied to keep long routes from over-bowing.
export const ROUTE_CURVE_MAX_OFFSET = 18;

// Number of points used to approximate the curved route line.
export const ROUTE_CURVE_SEGMENTS = 64;
