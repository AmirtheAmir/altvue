import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import AirportCodeMarker from "../../atoms/AirportCodeMarker";
import { cityDatabase } from "../../../db/cityDatabase";

// Delays React root unmounting until React finishes the current render cycle.
const scheduleRootUnmount = (root) => {
  setTimeout(() => root.unmount(), 0);
};

// Creates a lookup of selected airport codes and whether each is from or to.
export const getSelectedMarkerTypes = (fromAirport, toAirport) => {
  const selectedMarkerTypes = {};

  if (fromAirport?.code) {
    selectedMarkerTypes[fromAirport.code] = "from";
  }

  if (toAirport?.code) {
    selectedMarkerTypes[toAirport.code] = "to";
  }

  return selectedMarkerTypes;
};

// Creates React-rendered MapLibre markers and stores render/cleanup handlers.
export const createAirportMarkers = (
  map,
  isFlightActiveRef,
  markerEntries,
  selectedMarkerTypesRef,
) => {
  cityDatabase.forEach((cityItem) => {
    cityItem.airports.forEach((airport) => {
      const markerElement = document.createElement("div");
      const root = createRoot(markerElement);
      let isHovered = false;

      // Re-renders the marker when hover or selection state changes.
      const renderMarker = () => {
        const selectionType =
          selectedMarkerTypesRef.current[airport.code] ?? null;
        markerElement.style.zIndex = selectionType ? "20" : "0";

        root.render(
          <AirportCodeMarker
            code={airport.code}
            isFlightActive={isFlightActiveRef.current}
            isHovered={isHovered}
            selectionType={selectionType}
          />,
        );
      };

      // Marks this airport as hovered and refreshes the marker UI.
      const handleMouseEnter = () => {
        isHovered = true;
        renderMarker();
      };

      // Clears hover state and refreshes the marker UI.
      const handleMouseLeave = () => {
        isHovered = false;
        renderMarker();
      };

      renderMarker();

      markerElement.addEventListener("mouseenter", handleMouseEnter);
      markerElement.addEventListener("mouseleave", handleMouseLeave);

      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat(airport.coordinates)
        .addTo(map);

      markerEntries.set(airport.code, {
        renderMarker,
        cleanup: () => {
          markerElement.removeEventListener("mouseenter", handleMouseEnter);
          markerElement.removeEventListener("mouseleave", handleMouseLeave);
          marker.remove();
          scheduleRootUnmount(root);
        },
      });
    });
  });
};
