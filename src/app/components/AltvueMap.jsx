"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import * as turf from "@turf/turf";
import { createRoot } from "react-dom/client";
import { FLand, FTakeoff } from "../../../public/icons";
import AirportCodeAtom from "./atoms/AirportCodeAtom";
import FlightControlBillboardOrganism from "./organisms/FlightControlBillboardOrganism";
import { cityDatabase, defaultRoute } from "../db/cityDatabase";
import {
  airportByCode,
  airportCatalog,
  durationOptionsMinutes,
  getRouteDurationByCodes,
  getRoutesByDuration,
} from "../db/routeDurationDatabase";

const cityByName = cityDatabase.reduce((acc, cityRecord) => {
  acc[cityRecord.city] = cityRecord;
  return acc;
}, {});

const getAirportFromRoute = ({ city, airportCode }) => {
  const cityRecord = cityByName[city];

  if (!cityRecord) {
    return null;
  }

  const airportRecord = cityRecord.airports.find(
    (airport) => airport.code === airportCode,
  );

  if (!airportRecord) {
    return null;
  }

  return {
    ...airportRecord,
    city: cityRecord.city,
    country: cityRecord.country,
    continent: cityRecord.continent,
  };
};

const defaultFromAirport =
  getAirportFromRoute(defaultRoute.from) || airportCatalog[0] || null;
const defaultToAirport =
  getAirportFromRoute(defaultRoute.to) || airportCatalog[1] || null;

export default function AltvueMap() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const mapLoadedRef = useRef(false);
  const drawMapRef = useRef(null);

  const [mode, setMode] = useState("pilot");
  const [fromAirportCode, setFromAirportCode] = useState(
    defaultFromAirport?.code || null,
  );
  const [toAirportCode, setToAirportCode] = useState(
    defaultToAirport?.code || null,
  );
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(null);
  const [selectedAutopilotRouteId, setSelectedAutopilotRouteId] = useState(null);

  const fromAirport = fromAirportCode ? airportByCode[fromAirportCode] : null;
  const toAirport = toAirportCode ? airportByCode[toAirportCode] : null;

  const activeRouteDuration = getRouteDurationByCodes(
    fromAirportCode,
    toAirportCode,
  );

  const autopilotRoutes = useMemo(() => {
    if (!Number.isFinite(selectedDurationMinutes)) {
      return [];
    }

    return getRoutesByDuration(selectedDurationMinutes);
  }, [selectedDurationMinutes]);

  const resolvedAutopilotRouteId = useMemo(() => {
    if (!autopilotRoutes.length) {
      return null;
    }

    const hasSelectedRoute = selectedAutopilotRouteId
      ? autopilotRoutes.some(
          (routeRecord) => routeRecord.id === selectedAutopilotRouteId,
        )
      : false;

    return hasSelectedRoute ? selectedAutopilotRouteId : autopilotRoutes[0].id;
  }, [autopilotRoutes, selectedAutopilotRouteId]);

  const resolvedAutopilotRoute = useMemo(() => {
    if (!resolvedAutopilotRouteId) {
      return null;
    }

    return (
      autopilotRoutes.find(
        (routeRecord) => routeRecord.id === resolvedAutopilotRouteId,
      ) || null
    );
  }, [autopilotRoutes, resolvedAutopilotRouteId]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker, root }) => {
      root.unmount();
      marker.remove();
    });

    markersRef.current = [];
  }, []);

  const drawMapData = useCallback(() => {
    const map = mapRef.current;

    if (!map || !mapLoadedRef.current || !fromAirport || !toAirport) {
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

    clearMarkers();

    const createAirportMarker = ({ coordinates, code, type = "default" }) => {
      const markerEl = document.createElement("div");
      markerEl.className = "cursor-pointer";
      markerEl.style.zIndex = type === "default" ? "10" : "20";

      const root = createRoot(markerEl);
      const Icon = type === "from" ? FTakeoff : type === "to" ? FLand : null;

      root.render(<AirportCodeAtom code={code} Icon={Icon} />);

      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat(coordinates)
        .addTo(map);

      markersRef.current.push({ marker, root });
    };

    airportCatalog.forEach((airport) => {
      const isFromAirport = airport.code === fromAirport.code;
      const isToAirport = airport.code === toAirport.code;

      const markerType = isFromAirport ? "from" : isToAirport ? "to" : "default";

      createAirportMarker({
        coordinates: airport.coordinates,
        code: airport.code,
        type: markerType,
      });
    });

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
  }, [clearMarkers, fromAirport, toAirport]);

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

    map.addControl(new maplibregl.NavigationControl(), "top-right");

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

  const handleFromSelect = (airport) => {
    setFromAirportCode(airport.code);
  };

  const handleToSelect = (airport) => {
    setToAirportCode(airport.code);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);

    if (nextMode !== "autopilot" || !resolvedAutopilotRoute) {
      return;
    }

    setSelectedAutopilotRouteId(resolvedAutopilotRoute.id);
    setFromAirportCode(resolvedAutopilotRoute.from.code);
    setToAirportCode(resolvedAutopilotRoute.to.code);
  };

  const handleDurationSelect = (durationMinutes) => {
    setSelectedDurationMinutes(durationMinutes);

    const routesForDuration = getRoutesByDuration(durationMinutes);

    if (!routesForDuration.length) {
      setSelectedAutopilotRouteId(null);
      return;
    }

    const matchingRoute = routesForDuration.find(
      (routeRecord) => routeRecord.id === selectedAutopilotRouteId,
    );

    const nextRoute = matchingRoute || routesForDuration[0];

    setSelectedAutopilotRouteId(nextRoute.id);

    if (mode === "autopilot") {
      setFromAirportCode(nextRoute.from.code);
      setToAirportCode(nextRoute.to.code);
    }
  };

  const handleAutopilotRouteSelect = (routeId) => {
    const selectedRoute = autopilotRoutes.find(
      (routeRecord) => routeRecord.id === routeId,
    );

    if (!selectedRoute) {
      return;
    }

    setSelectedAutopilotRouteId(routeId);
    setFromAirportCode(selectedRoute.from.code);
    setToAirportCode(selectedRoute.to.code);
  };

  return (
    <section className="relative h-full w-full overflow-hidden bg-dark-50 font-sans">
      <div ref={mapContainerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute top-[196px] left-1/2 z-40 w-full -translate-x-1/2 px-4">
        <div className="pointer-events-auto">
          <FlightControlBillboardOrganism
            mode={mode}
            onModeChange={handleModeChange}
            airports={airportCatalog}
            fromAirport={fromAirport}
            toAirport={toAirport}
            onFromSelect={handleFromSelect}
            onToSelect={handleToSelect}
            durationLabel={activeRouteDuration?.durationLabel || null}
            selectedDurationMinutes={selectedDurationMinutes}
            durationOptionsMinutes={durationOptionsMinutes}
            onDurationSelect={handleDurationSelect}
            autopilotRoutes={autopilotRoutes}
            selectedAutopilotRouteId={resolvedAutopilotRouteId}
            onAutopilotRouteSelect={handleAutopilotRouteSelect}
          />
        </div>
      </div>
    </section>
  );
}
