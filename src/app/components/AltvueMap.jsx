"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import AirportCodeMarker from "./atoms/AirportCodeMarker";
import { cityDatabase } from "../db/cityDatabase";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";
const INITIAL_CENTER = [-40, 43];
const INITIAL_ZOOM = 2.2;

const setPaintIfLayerExists = (map, layerId, property, value) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, property, value);
  }
};

const setLayoutIfLayerExists = (map, layerId, property, value) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, property, value);
  } else {
    console.log(`Missing layout layer: ${layerId}`);
  }
};

const removeSmallPlaceLabels = (map) => {
  const layersToHide = [
    "place_state",
    "place_city",
    "place_village",
    "place_suburb",
    "place_other",
    "highway_name_other",
    "place_country_other",
  ];

  layersToHide.forEach((layerId) => {
    setLayoutIfLayerExists(map, layerId, "visibility", "none");
  });
};

const applyEnglishOnlyLabels = (map) => {
  const labelLayers = [
    "place_country_major",
    "place_country_minor",
    "place_country_other",
    "place_state",
    "place_city_large",
    "place_city",
    "place_village",
    "place_suburb",
    "place_other",
    "highway_name_other",
  ];

  labelLayers.forEach((layerId) => {
    setLayoutIfLayerExists(map, layerId, "text-field", [
      "coalesce",
      ["get", "name:latin"],
      ["get", "name_en"],
      ["get", "name"],
    ]);
  });
};

const applyBaseMapTheme = (map) => {
  setPaintIfLayerExists(map, "water", "fill-color", "#0A0A0A");
  setPaintIfLayerExists(map, "background", "background-color", "#292929");
  setPaintIfLayerExists(map, "boundary_state", "line-color", "#292929");
  setPaintIfLayerExists(map, "boundary_country_z0-4", "line-color", "#3D3D3D");
  setPaintIfLayerExists(map, "boundary_state", "line-dasharray", null);

  applyEnglishOnlyLabels(map);

  removeSmallPlaceLabels(map);
};

const createAirportMarkers = (map) => {
  cityDatabase.forEach((cityItem) => {
    cityItem.airports.forEach((airport) => {
      const markerElement = document.createElement("div");

      const root = createRoot(markerElement);

      const renderMarker = (isHovered = false) => {
        root.render(<AirportCodeMarker code={airport.code} isHovered={isHovered} />);
      };

      renderMarker(false);

      markerElement.addEventListener("mouseenter", () => {
        renderMarker(true);
      });
      markerElement.addEventListener("mouseleave", () => {
        renderMarker(false);
      });

      new maplibregl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat(airport.coordinates)
        .addTo(map);
    });
  });
};

export default function AltvueMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      applyBaseMapTheme(map);
      createAirportMarkers(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="relative h-full w-full overflow-hidden bg-dark-50 z-0">
      <div ref={mapContainerRef} className="h-full w-full" />
    </section>
  );
}
