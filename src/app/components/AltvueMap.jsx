"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import * as turf from "@turf/turf";
import { createRoot } from "react-dom/client";
import { FLand, FTakeoff } from "../../../public/icons";

export default function AltvueMap() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const JFK = [-73.7781, 40.6413];
    const LIS = [-9.1359, 38.7742];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/dark",
      center: [-40, 43],
      zoom: 2.2,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      const setPaintIfLayerExists = (layerId, property, value) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, property, value);
        }
      };

      // WATER
      setPaintIfLayerExists("water", "fill-color", "#0b0a09");

      // LAND
      setPaintIfLayerExists("land", "background-color", "#2C2A26");
      setPaintIfLayerExists("background", "background-color", "#2C2A26");

      // -----------------------------
      // 1. AIRPORT POINTS
      // -----------------------------
      const airportsGeoJSON = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              code: "JFK",
              city: "New York",
            },
            geometry: {
              type: "Point",
              coordinates: JFK,
            },
          },
          {
            type: "Feature",
            properties: {
              code: "LIS",
              city: "Lisbon",
            },
            geometry: {
              type: "Point",
              coordinates: LIS,
            },
          },
        ],
      };

      map.addSource("airports", {
        type: "geojson",
        data: airportsGeoJSON,
      });

      const createAirportMarker = ({ coordinates, code, type = "from" }) => {
        const markerEl = document.createElement("div");
        markerEl.className = "cursor-pointer";

        const root = createRoot(markerEl);

        const Icon = type === "from" ? FTakeoff : FLand;

        root.render(
          <div className="flex items-center gap-1.5 rounded-xl border-2 border-orange-500 bg-dark-50 pr-3 pl-2.5 py-1.5">
            <span className="flex items-center justify-center text-orange-500">
              <Icon className="" />
            </span>

            <span className="font-L-700 text-orange-500">
              {code}
            </span>
          </div>,
        );

        new maplibregl.Marker({
          element: markerEl,
          anchor: "center",
        })
          .setLngLat(coordinates)
          .addTo(map);
      };

      createAirportMarker({
        coordinates: JFK,
        code: "JFK",
        type: "from",
      });

      createAirportMarker({
        coordinates: LIS,
        code: "LIS",
        type: "to",
      });

      // -----------------------------
      // 2. ROUTE LINE
      // -----------------------------
      const routeLine = turf.lineString([JFK, LIS]);
      const routeDistance = turf.length(routeLine, { units: "kilometers" });

      const steps = 400;
      const arc = [];

      for (let i = 0; i <= steps; i++) {
        const segment = turf.along(routeLine, (routeDistance / steps) * i, {
          units: "kilometers",
        });

        arc.push(segment.geometry.coordinates);
      }

      const routeGeoJSON = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: arc,
        },
      };

      map.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#888277",
          "line-width": 2,
        },
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <section className="relative h-full w-full overflow-hidden bg-dark-50 font-sans">
      <div ref={mapContainerRef} className="h-full w-full" />
    </section>
  );
}
