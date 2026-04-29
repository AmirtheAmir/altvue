import { useEffect, useRef } from "react";
import {
  PLANE_ANIMATION_BEARING_LOOKAHEAD,
  PLANE_ROUTE_IMAGE_ID,
  PLANE_ROUTE_ICON_SIZE,
  PLANE_ROUTE_ICON_ROTATION_OFFSET,
  PLANE_ROUTE_FOLLOW_ZOOM,
  PLANE_ROUTE_LAYER_ID,
  PLANE_ROUTE_SOURCE_ID,
} from "../config/mapConfig";
import {
  createCurvedRouteCoordinates,
  getRouteCoordinateAtProgress,
} from "../utils/routeUtils";
import { getFlightProgress } from "../../../utils/flightTiming";

const EMPTY_PLANE_DATA = {
  type: "FeatureCollection",
  features: [],
};

const PLANE_ICON_SVG = `
  <svg width="52" height="52" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.9283 18.7509L28.4535 16.4664L17.5572 12.7733L16.2513 6.49092C16.0542 5.54285 15.1299 4.93662 14.1818 5.13369C13.2337 5.33075 12.6275 6.25514 12.8246 7.20321L14.1304 13.4856L5.60842 21.215L6.08327 23.4995L15.1988 18.6257L16.5047 24.9081L14.0052 27.2151L14.3614 28.9284L18.6929 26.8365L23.4994 27.029L23.1432 25.3156L19.9315 24.1958L18.6256 17.9134L28.9283 18.7509Z" fill="#DC252B"/>
  </svg>
`;

// Converts two geographic positions into the on-screen angle the icon should
// face. Using projected screen points keeps the rotation visually aligned with
// the curved route as it appears in the current map view.
const getPlaneBearing = (map, currentCoordinates, nextCoordinates) => {
  if (!currentCoordinates || !nextCoordinates) {
    return null;
  }

  const currentPoint = map.project(currentCoordinates);
  const nextPoint = map.project(nextCoordinates);
  const deltaX = nextPoint.x - currentPoint.x;
  const deltaY = nextPoint.y - currentPoint.y;

  if (!deltaX && !deltaY) {
    return null;
  }

  return (
    (Math.atan2(deltaY, deltaX) * 180) / Math.PI +
    PLANE_ROUTE_ICON_ROTATION_OFFSET
  );
};

// Builds the GeoJSON payload consumed by the MapLibre plane source.
const getPlaneData = (coordinates, bearing = 0) => {
  if (!coordinates) {
    return EMPTY_PLANE_DATA;
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { bearing },
        geometry: {
          type: "Point",
          coordinates,
        },
      },
    ],
  };
};

// Turns the inline SVG into an Image object so MapLibre can register it as a
// reusable symbol image.
const createPlaneImage = () => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const svgBlob = new Blob([PLANE_ICON_SVG], { type: "image/svg+xml" });
    const imageUrl = URL.createObjectURL(svgBlob);

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to load route plane icon."));
    };

    image.src = imageUrl;
  });
};

// Registers the plane symbol image once per map instance.
const ensurePlaneImage = async (map) => {
  if (map.hasImage(PLANE_ROUTE_IMAGE_ID)) {
    return;
  }

  const image = await createPlaneImage();

  if (!map.hasImage(PLANE_ROUTE_IMAGE_ID)) {
    map.addImage(PLANE_ROUTE_IMAGE_ID, image, { pixelRatio: 2 });
  }
};

// Ensures the dedicated GeoJSON source and symbol layer exist before the
// animation starts. The layer reads its rotation from each feature's `bearing`
// property, so moving the plane only requires updating source data.
const ensurePlaneLayer = async (map) => {
  await ensurePlaneImage(map);

  if (!map.getSource(PLANE_ROUTE_SOURCE_ID)) {
    map.addSource(PLANE_ROUTE_SOURCE_ID, {
      type: "geojson",
      data: EMPTY_PLANE_DATA,
    });
  }

  if (!map.getLayer(PLANE_ROUTE_LAYER_ID)) {
    map.addLayer({
      id: PLANE_ROUTE_LAYER_ID,
      type: "symbol",
      source: PLANE_ROUTE_SOURCE_ID,
      layout: {
        "icon-allow-overlap": true,
        "icon-anchor": "center",
        "icon-ignore-placement": true,
        "icon-image": PLANE_ROUTE_IMAGE_ID,
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "viewport",
        "icon-size": PLANE_ROUTE_ICON_SIZE,
      },
    });
  }

  map.moveLayer(PLANE_ROUTE_LAYER_ID);
};

// Pushes the latest plane position into the existing MapLibre source.
const updatePlaneLayer = (map, coordinates, bearing) => {
  const source = map.getSource(PLANE_ROUTE_SOURCE_ID);

  if (source) {
    source.setData(getPlaneData(coordinates, bearing));
  }
};

// Keeps the camera centered on the plane without forcing users out of a closer
// zoom level they may already be using.
const updateFollowCamera = (map, coordinates) => {
  if (map.getZoom() < PLANE_ROUTE_FOLLOW_ZOOM) {
    map.jumpTo({
      center: coordinates,
      zoom: PLANE_ROUTE_FOLLOW_ZOOM,
    });
    return;
  }

  map.setCenter(coordinates);
};

// In locked mode the visible plane is a fixed DOM overlay. That removes the
// tiny projection jitter that happens when a MapLibre symbol and camera both
// move every frame.
const updatePlaneOverlay = (planeOverlay, bearing, isVisible) => {
  if (!planeOverlay) {
    return;
  }

  planeOverlay.style.display = isVisible ? "block" : "none";
  planeOverlay.style.transform = "translate(-50%, -50%)";

  if (isVisible) {
    const planeIcon = planeOverlay.firstElementChild;

    if (planeIcon) {
      planeIcon.style.transform = `rotate(${bearing}deg)`;
      planeIcon.style.transformBox = "fill-box";
      planeIcon.style.transformOrigin = "center";
    }
  }
};

// Hides the plane by replacing the source contents with an empty collection.
const clearPlaneLayer = (map) => {
  updatePlaneLayer(map, null, 0);
};

// Keeps the map's plane marker in sync with the current flight plan.
export const usePlaneRouteAnimation = ({
  followPlane = false,
  flightPlan,
  mapRef,
  planeOverlayRef,
}) => {
  // Stores the active requestAnimationFrame handle so it can be cancelled across
  // renders without causing React updates.
  const frameRef = useRef(null);
  const isMapPlaneVisibleRef = useRef(false);

  useEffect(() => {
    const planeOverlay = planeOverlayRef.current;

    // Stops the browser animation loop but leaves the current plane data alone.
    const clearAnimationFrame = () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    // Stops motion and removes the plane from the map when the flight is no
    // longer drawable.
    const cleanupPlane = () => {
      clearAnimationFrame();

      if (mapRef.current) {
        clearPlaneLayer(mapRef.current);
        isMapPlaneVisibleRef.current = false;
      }

      updatePlaneOverlay(planeOverlay, 0, false);
    };

    if (
      !flightPlan?.fromAirport?.coordinates ||
      !flightPlan?.toAirport?.coordinates ||
      !flightPlan?.durationMs
    ) {
      cleanupPlane();
      return;
    }

    const map = mapRef.current;

    if (!map) {
      return;
    }

    let isAnimationCancelled = false;

    const startPlaneAnimation = async () => {
      // A new flight plan replaces any previous animation loop.
      clearAnimationFrame();
      await ensurePlaneLayer(map);

      if (isAnimationCancelled) {
        return;
      }

      // Use the same generated curve as the route layer so the plane sits on the
      // exact visual path shown on the map.
      const routeCoordinates = createCurvedRouteCoordinates(
        flightPlan.fromAirport.coordinates,
        flightPlan.toAirport.coordinates,
      );
      const initialCoordinates = getRouteCoordinateAtProgress(routeCoordinates, 0);

      if (!initialCoordinates) {
        return;
      }

      const bearingProgressStep =
        PLANE_ANIMATION_BEARING_LOOKAHEAD / flightPlan.durationMs;
      let latestBearing = 0;

      const updatePlanePosition = () => {
        // Progress is derived from the shared flight session model, so the map,
        // timer, pause, and resume states all stay in lockstep.
        const progress = getFlightProgress(flightPlan);
        const currentCoordinates = getRouteCoordinateAtProgress(
          routeCoordinates,
          progress,
        );

        if (!currentCoordinates) {
          clearAnimationFrame();
          return;
        }

        if (followPlane) {
          updateFollowCamera(map, currentCoordinates);
        }

        const nextCoordinates = getRouteCoordinateAtProgress(
          routeCoordinates,
          Math.min(progress + bearingProgressStep, 1),
        );
        // Sample slightly ahead on the route so the icon rotates toward its next
        // movement direction instead of lagging behind the curve.
        const nextBearing = getPlaneBearing(
          map,
          currentCoordinates,
          nextCoordinates,
        );

        if (nextBearing !== null) {
          latestBearing = nextBearing;
        }

        if (followPlane) {
          if (isMapPlaneVisibleRef.current) {
            clearPlaneLayer(map);
            isMapPlaneVisibleRef.current = false;
          }

          updatePlaneOverlay(planeOverlay, latestBearing, true);
        } else {
          updatePlaneOverlay(planeOverlay, latestBearing, false);
          // Update only the GeoJSON source data. MapLibre redraws the symbol in
          // the correct place for the current zoom and projection.
          updatePlaneLayer(map, currentCoordinates, latestBearing);
          isMapPlaneVisibleRef.current = true;
        }

        if (progress >= 1) {
          clearAnimationFrame();
          return;
        }

        if (flightPlan.isPaused) {
          clearAnimationFrame();
          return;
        }

        frameRef.current = window.requestAnimationFrame(updatePlanePosition);
      };

      // Drive movement from the browser paint loop for smoother animation.
      frameRef.current = window.requestAnimationFrame(updatePlanePosition);
    };

    startPlaneAnimation().catch(() => cleanupPlane());

    return () => {
      isAnimationCancelled = true;
      clearAnimationFrame();
    };
  }, [followPlane, mapRef, planeOverlayRef, flightPlan]);

  useEffect(() => {
    const map = mapRef.current;
    const planeOverlay = planeOverlayRef.current;

    // Removes any leftover animation work and clears the plane on unmount.
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (map) {
        clearPlaneLayer(map);
      }

      updatePlaneOverlay(planeOverlay, 0, false);
    };
  }, [mapRef, planeOverlayRef]);
};
