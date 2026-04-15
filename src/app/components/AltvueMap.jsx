"use client";

import { useCallback, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import * as turf from "@turf/turf";
import { createRoot } from "react-dom/client";
import { FLand, FTakeoff } from "../../../public/icons";
import AirportCode from "./atoms/AirportCode";
import { airportByCode, airportCatalog } from "../db/routeDurationDatabase";

export default function AltvueMap({ fromAirportCode = null, toAirportCode = null }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef(new Map());
  const mapLoadedRef = useRef(false);
  const drawMapRef = useRef(null);

  const fromAirport = fromAirportCode ? airportByCode[fromAirportCode] : null;
  const toAirport = toAirportCode ? airportByCode[toAirportCode] : null;

  const clearMarkers = useCallback(() => {
    const markersToClear = Array.from(markersRef.current.values());

    markersRef.current = new Map();

    markersToClear.forEach(({ marker }) => {
      marker.remove();
    });
  }, []);

  const drawMapData = useCallback(() => {
    const map = mapRef.current;

    if (!map || !mapLoadedRef.current) {
      return;
    }

    const airportsGeoJSON = {
      type: "FeatureCollection",
      features: airportCatalog.map((airport) => ({
        type: "Feature",
        properties: {
          code: airport.code,
          city: airport.city,
          country: airport.country,
        },
        geometry: {
          type: "Point",
          coordinates: airport.coordinates,
        },
      })),
    };

    const airportsSource = map.getSource("airports");

    if (airportsSource) {
      airportsSource.setData(airportsGeoJSON);
    } else {
      map.addSource("airports", {
        type: "geojson",
        data: airportsGeoJSON,
      });
    }

    const upsertAirportMarker = (airport, type = "default") => {
      const Icon = type === "from" ? FTakeoff : type === "to" ? FLand : null;
      const markerRecord = markersRef.current.get(airport.code);

      if (markerRecord) {
        markerRecord.marker.getElement().style.zIndex =
          type === "default" ? "10" : "20";
        markerRecord.root.render(<AirportCode code={airport.code} Icon={Icon} />);
        return;
      }

      const markerEl = document.createElement("div");
      markerEl.className = "cursor-pointer";
      markerEl.style.zIndex = type === "default" ? "10" : "20";

      const root = createRoot(markerEl);

      root.render(<AirportCode code={airport.code} Icon={Icon} />);

      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat(airport.coordinates)
        .addTo(map);

      markersRef.current.set(airport.code, { marker, root });
    };

    airportCatalog.forEach((airport) => {
      const isFromAirport = airport.code === fromAirport?.code;
      const isToAirport = airport.code === toAirport?.code;

      const markerType = isFromAirport ? "from" : isToAirport ? "to" : "default";

      upsertAirportMarker(airport, markerType);
    });

    if (!fromAirport || !toAirport) {
      if (map.getLayer("route-line")) {
        map.removeLayer("route-line");
      }

      if (map.getSource("route")) {
        map.removeSource("route");
      }

      return;
    }

    const routeLine = turf.lineString([fromAirport.coordinates, toAirport.coordinates]);
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

    const routeSource = map.getSource("route");

    if (routeSource) {
      routeSource.setData(routeGeoJSON);
    } else {
      map.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
      });
    }

    if (!map.getLayer("route-line")) {
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
    }
  }, [fromAirport, toAirport]);

  useEffect(() => {
    drawMapRef.current = drawMapData;
  }, [drawMapData]);

  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/dark",
      center: [-40, 43],
      zoom: 2.2,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      const setPaintIfLayerExists = (layerId, property, value) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, property, value);
        }
      };

      setPaintIfLayerExists("water", "fill-color", "#0b0a09");
      setPaintIfLayerExists("land", "background-color", "#2C2A26");
      setPaintIfLayerExists("background", "background-color", "#2C2A26");

      mapLoadedRef.current = true;

      if (drawMapRef.current) {
        drawMapRef.current();
      }
    });

    return () => {
      mapLoadedRef.current = false;
      clearMarkers();

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [clearMarkers]);

  useEffect(() => {
    if (mapLoadedRef.current) {
      drawMapData();
    }
  }, [drawMapData]);

  return (
    <section className="relative h-full w-full overflow-hidden bg-dark-50 font-sans">
      <div ref={mapContainerRef} className="h-full w-full" />
    </section>
  );
}
