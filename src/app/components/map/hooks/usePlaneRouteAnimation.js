import { useEffect, useRef } from "react";
import {
  PLANE_ANIMATION_BEARING_LOOKAHEAD,
  PLANE_ROUTE_IMAGE_ID,
  PLANE_ROUTE_ICON_SIZE,
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
  <svg width="52" height="48" viewBox="-2 -2 34 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.21569 26.6626L11.8816 26.7441L18.0553 16.8503L25.3875 16.9783C26.494 16.9976 29.3985 16.3815 29.445 13.7153C29.4916 11.049 26.6103 10.332 25.5038 10.3126L18.1716 10.1847L12.347 0.0814638L7.68108 1.92411e-05L11.506 10.0683L4.82866 10.6185L2.23221 6.57259L0.232518 6.53769L1.4493 13.2266L-0.000180507 19.869L1.99951 19.9039L4.73558 15.951L11.3896 16.734L7.21569 26.6626Z" fill="#FCA902"/>
  </svg>
`;

// Calculates the icon rotation in screen space so it follows the route the user
// actually sees after map projection.
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

  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
};

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

const ensurePlaneImage = async (map) => {
  if (map.hasImage(PLANE_ROUTE_IMAGE_ID)) {
    return;
  }

  const image = await createPlaneImage();

  if (!map.hasImage(PLANE_ROUTE_IMAGE_ID)) {
    map.addImage(PLANE_ROUTE_IMAGE_ID, image, { pixelRatio: 2 });
  }
};

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
};

const updatePlaneLayer = (map, coordinates, bearing) => {
  const source = map.getSource(PLANE_ROUTE_SOURCE_ID);

  if (source) {
    source.setData(getPlaneData(coordinates, bearing));
  }
};

const clearPlaneLayer = (map) => {
  updatePlaneLayer(map, null, 0);
};

// Starts or restarts the plane marker animation whenever a new flight plan is set.
export const usePlaneRouteAnimation = ({ mapRef, flightPlan }) => {
  // Keep the animation frame ID outside React state because it is an imperative
  // browser resource and should not cause React re-renders.
  const frameRef = useRef(null);

  useEffect(() => {
    // Stops the animation frame loop without removing the current marker.
    const clearAnimationFrame = () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    // Clears the active plane point when the route becomes invalid.
    const cleanupPlane = () => {
      clearAnimationFrame();

      if (mapRef.current) {
        clearPlaneLayer(mapRef.current);
      }
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
      // If Take Off is clicked again, stop the old frame loop before starting over.
      clearAnimationFrame();
      await ensurePlaneLayer(map);

      if (isAnimationCancelled) {
        return;
      }

      // Reuse the same curved path as the visible route line so the marker
      // travels exactly over the route the user sees.
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
        // Progress comes from the shared flight session, so pause/resume affects
        // the map plane and the panel countdown in exactly the same way.
        const progress = getFlightProgress(flightPlan);
        const currentCoordinates = getRouteCoordinateAtProgress(
          routeCoordinates,
          progress,
        );
        const nextCoordinates = getRouteCoordinateAtProgress(
          routeCoordinates,
          Math.min(progress + bearingProgressStep, 1),
        );
        // Look one tick ahead to rotate the plane toward where it is moving next.
        const nextBearing = getPlaneBearing(
          map,
          currentCoordinates,
          nextCoordinates,
        );

        if (nextBearing !== null) {
          latestBearing = nextBearing;
        }

        if (!currentCoordinates) {
          clearAnimationFrame();
          return;
        }

        // Update the MapLibre source so the plane is rendered by the same WebGL
        // map as the route line. This keeps it pinned to the line while zooming.
        updatePlaneLayer(map, currentCoordinates, latestBearing);

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

      // Use the browser paint loop for smooth movement instead of stepped timers.
      frameRef.current = window.requestAnimationFrame(updatePlanePosition);
    };

    startPlaneAnimation().catch(() => cleanupPlane());

    return () => {
      isAnimationCancelled = true;
      clearAnimationFrame();
    };
  }, [mapRef, flightPlan]);

  useEffect(() => {
    const map = mapRef.current;

    // Final cleanup for page unmounts.
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (map) {
        clearPlaneLayer(map);
      }
    };
  }, [mapRef]);
};
