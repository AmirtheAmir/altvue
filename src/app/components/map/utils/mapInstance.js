export const isMapInstance = (map) => {
  return (
    Boolean(map) &&
    typeof map.getSource === "function" &&
    typeof map.getLayer === "function" &&
    typeof map.loaded === "function"
  );
};
