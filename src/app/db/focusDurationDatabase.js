import { getCityCenterByName } from "@/lib/citiesApi";

const EARTH_RADIUS_KM = 6371;
const DEFAULT_FOCUS_MINUTES = 120;
const SAME_CITY_FOCUS_MINUTES = 10;

const FOCUS_DURATION_BY_DISTANCE_KM = [
  [50, 10],
  [150, 15],
  [300, 20],
  [600, 25],
  [900, 30],
  [1200, 35],
  [1600, 40],
  [2200, 45],
  [2800, 50],
  [3500, 55],
  [4200, 60],
  [5000, 65],
  [6000, 70],
  [7000, 75],
  [8000, 80],
  [9000, 85],
  [10000, 90],
  [11000, 95],
  [12000, 100],
  [13000, 105],
  [14000, 110],
  [15000, 115],
];

const degreesToRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const getDistanceKm = (fromCoordinates, toCoordinates) => {
  const [fromLng, fromLat] = fromCoordinates;
  const [toLng, toLat] = toCoordinates;

  const latDelta = degreesToRadians(toLat - fromLat);
  const lngDelta = degreesToRadians(toLng - fromLng);

  const fromLatRadians = degreesToRadians(fromLat);
  const toLatRadians = degreesToRadians(toLat);

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLatRadians) *
      Math.cos(toLatRadians) *
      Math.sin(lngDelta / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS_KM *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

const getFocusMinutesByDistanceKm = (distanceKm) => {
  const focusDuration = FOCUS_DURATION_BY_DISTANCE_KM.find(
    ([maxDistanceKm]) => distanceKm <= maxDistanceKm,
  );

  return focusDuration?.[1] ?? DEFAULT_FOCUS_MINUTES;
};

const createFocusDuration = (minutes, distanceKm) => {
  return {
    minutes,
    distanceKm,
    label: `${minutes} min focus flight`,
  };
};

export const getFocusDurationByCities = (cities, fromCity, toCity) => {
  if (!fromCity || !toCity) {
    return null;
  }

  if (fromCity === toCity) {
    return createFocusDuration(SAME_CITY_FOCUS_MINUTES, 0);
  }

  const fromCoordinates = getCityCenterByName(cities, fromCity);
  const toCoordinates = getCityCenterByName(cities, toCity);

  if (!fromCoordinates || !toCoordinates) {
    return null;
  }

  const distanceKm = Math.round(getDistanceKm(fromCoordinates, toCoordinates));

  return createFocusDuration(
    getFocusMinutesByDistanceKm(distanceKm),
    distanceKm,
  );
};

export const getFocusDurationByAirports = (cities, fromAirport, toAirport) => {
  return getFocusDurationByCities(cities, fromAirport?.city, toAirport?.city);
};
