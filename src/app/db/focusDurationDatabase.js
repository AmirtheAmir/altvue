import { getCityCenterByName } from "./cityDatabase";

export const FOCUS_DURATION_MINUTES = [
  10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
  70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120,
];

const EARTH_RADIUS_KM = 6371;

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
  if (distanceKm <= 50) return 10;
  if (distanceKm <= 150) return 15;
  if (distanceKm <= 300) return 20;
  if (distanceKm <= 600) return 25;
  if (distanceKm <= 900) return 30;
  if (distanceKm <= 1200) return 35;
  if (distanceKm <= 1600) return 40;
  if (distanceKm <= 2200) return 45;
  if (distanceKm <= 2800) return 50;
  if (distanceKm <= 3500) return 55;
  if (distanceKm <= 4200) return 60;
  if (distanceKm <= 5000) return 65;
  if (distanceKm <= 6000) return 70;
  if (distanceKm <= 7000) return 75;
  if (distanceKm <= 8000) return 80;
  if (distanceKm <= 9000) return 85;
  if (distanceKm <= 10000) return 90;
  if (distanceKm <= 11000) return 95;
  if (distanceKm <= 12000) return 100;
  if (distanceKm <= 13000) return 105;
  if (distanceKm <= 14000) return 110;
  if (distanceKm <= 15000) return 115;

  return 120;
};

export const getFocusDurationByCities = (fromCity, toCity) => {
  if (!fromCity || !toCity) {
    return null;
  }

  if (fromCity === toCity) {
    return {
      minutes: 10,
      distanceKm: 0,
      label: "10 min focus flight",
    };
  }

  const fromCoordinates = getCityCenterByName(fromCity);
  const toCoordinates = getCityCenterByName(toCity);

  if (!fromCoordinates || !toCoordinates) {
    return null;
  }

  const distanceKm = Math.round(
    getDistanceKm(fromCoordinates, toCoordinates)
  );

  const minutes = getFocusMinutesByDistanceKm(distanceKm);

  return {
    minutes,
    distanceKm,
    label: `${minutes} min focus flight`,
  };
};

export const getFocusDurationByAirports = (fromAirport, toAirport) => {
  return getFocusDurationByCities(fromAirport?.city, toAirport?.city);
};