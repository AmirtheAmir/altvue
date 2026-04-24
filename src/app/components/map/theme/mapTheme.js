// Applies a paint property only when the target MapLibre layer exists.
const setPaintIfLayerExists = (map, layerId, property, value) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, property, value);
  }
};

// Applies a layout property only when the target MapLibre layer exists.
const setLayoutIfLayerExists = (map, layerId, property, value) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, property, value);
  } else {
    console.log(`Missing layout layer: ${layerId}`);
  }
};

// Base map label layer IDs hidden to reduce map noise around airport markers.
const SMALL_PLACE_LABEL_LAYERS = [
  "place_state",
  "place_city",
  "place_village",
  "place_suburb",
  "place_other",
  "highway_name_other",
  "place_country_other",
];

// Base map label layer IDs updated to prefer English or Latin names.
const LOCALIZED_LABEL_LAYERS = [
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

// Hides smaller place labels so airport markers and the route stay readable.
const removeSmallPlaceLabels = (map) => {
  SMALL_PLACE_LABEL_LAYERS.forEach((layerId) => {
    setLayoutIfLayerExists(map, layerId, "visibility", "none");
  });
};

// Sets label text to prefer Latin/English names before falling back to default names.
const applyEnglishOnlyLabels = (map) => {
  LOCALIZED_LABEL_LAYERS.forEach((layerId) => {
    setLayoutIfLayerExists(map, layerId, "text-field", [
      "coalesce",
      ["get", "name:latin"],
      ["get", "name_en"],
      ["get", "name"],
    ]);
  });
};

// Applies the custom dark styling and label cleanup after the map style loads.
export const applyBaseMapTheme = (map) => {
  setPaintIfLayerExists(map, "water", "fill-color", "#0A0A0A");
  setPaintIfLayerExists(map, "background", "background-color", "#292929");
  setPaintIfLayerExists(map, "boundary_state", "line-color", "#292929");
  setPaintIfLayerExists(map, "boundary_country_z0-4", "line-color", "#3D3D3D");
  setPaintIfLayerExists(map, "boundary_state", "line-dasharray", null);

  applyEnglishOnlyLabels(map);
  removeSmallPlaceLabels(map);
};
