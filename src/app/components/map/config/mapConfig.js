// URL of the MapLibre style used to render the base map.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

// Initial map center passed to MapLibre as [longitude, latitude].
export const INITIAL_CENTER = [-40, 43];

// Initial zoom level passed to MapLibre when the map is created.
export const INITIAL_ZOOM = 2.5;

// Animation duration in milliseconds when focusing a selected airport.
export const MAP_FOCUS_DURATION = 1200;

// GeoJSON source ID used by MapLibre for the selected route line.
export const ROUTE_SOURCE_ID = "selected-airport-route";

// Layer ID used by MapLibre to draw the selected route line.
export const ROUTE_LAYER_ID = "selected-airport-route-line";

// Route line color, matching the dark-400 design token.
export const ROUTE_LINE_COLOR = "#413939";

// Route line width in pixels.
export const ROUTE_LINE_WIDTH = 2;

// Curve strength used when calculating the route control point.
export const ROUTE_CURVE_STRENGTH = 0.2;

// Maximum geographic offset applied to keep long routes from over-bowing.
export const ROUTE_CURVE_MAX_OFFSET = 18;

// Number of points used to approximate the curved route line.
export const ROUTE_CURVE_SEGMENTS = 64;

// How far ahead the plane looks when calculating its rotation.
export const PLANE_ANIMATION_BEARING_LOOKAHEAD = 500;

// Minimum zoom used while the camera is locked to the animated plane.
export const PLANE_ROUTE_FOLLOW_ZOOM = 8;

// Image ID used by MapLibre for the animated route plane icon.
export const PLANE_ROUTE_IMAGE_ID = "animated-route-plane-image";

// GeoJSON source ID used by MapLibre for the animated plane point.
export const PLANE_ROUTE_SOURCE_ID = "animated-route-plane";

// Layer ID used by MapLibre to draw the animated plane symbol.
export const PLANE_ROUTE_LAYER_ID = "animated-route-plane-symbol";

// Rotation correction for the airplane_28 SVG so its nose follows route travel.
export const PLANE_ROUTE_ICON_ROTATION_OFFSET = 102;

// Visual scale for the animated plane symbol on the map.
export const PLANE_ROUTE_ICON_SIZE = 1.5;

// Pixel size used by the fixed plane overlay while the camera is locked.
export const PLANE_ROUTE_OVERLAY_SIZE = (52 / 2) * PLANE_ROUTE_ICON_SIZE;
