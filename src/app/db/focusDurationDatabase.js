import { getCityCenterByName } from "./cityDatabase";

export const FOCUS_DURATION = {
  LOCAL_HOP: 15,
  SHORT_ROUTE: 25,
  REGIONAL_ROUTE: 35,
  INTERNATIONAL_ROUTE: 45,
  LONG_HAUL: 60,
  DEEP_FLIGHT: 75,
  OCEANIC_FLOW: 90,
};

export const FOCUS_DURATION_LABELS = {
  LOCAL_HOP: "Local hop",
  SHORT_ROUTE: "Short route",
  REGIONAL_ROUTE: "Regional route",
  INTERNATIONAL_ROUTE: "International route",
  LONG_HAUL: "Long haul",
  DEEP_FLIGHT: "Deep flight",
  OCEANIC_FLOW: "Oceanic flow",
};

export const FOCUS_DURATION_CITY_PROFILES = {
  "New York": {
    country: "United States of America",
    region: "north-america-east",
    continent: "north-america",
  },
  London: {
    country: "United Kingdom",
    region: "western-europe",
    continent: "europe",
  },
  Paris: {
    country: "France",
    region: "western-europe",
    continent: "europe",
  },
  Tokyo: {
    country: "Japan",
    region: "east-asia",
    continent: "asia",
  },
  Lisbon: {
    country: "Portugal",
    region: "southern-europe",
    continent: "europe",
  },
  Frankfurt: {
    country: "Germany",
    region: "western-europe",
    continent: "europe",
  },
  Amsterdam: {
    country: "Netherlands",
    region: "western-europe",
    continent: "europe",
  },
  Madrid: {
    country: "Spain",
    region: "southern-europe",
    continent: "europe",
  },
  Rome: {
    country: "Italy",
    region: "southern-europe",
    continent: "europe",
  },
  Istanbul: {
    country: "Turkey",
    region: "europe-middle-east",
    continent: "europe-asia",
  },
  "Los Angeles": {
    country: "United States of America",
    region: "north-america-west",
    continent: "north-america",
  },
  Chicago: {
    country: "United States of America",
    region: "north-america-midwest",
    continent: "north-america",
  },
  Toronto: {
    country: "Canada",
    region: "north-america-east",
    continent: "north-america",
  },
  Vancouver: {
    country: "Canada",
    region: "north-america-west",
    continent: "north-america",
  },
  Dubai: {
    country: "United Arab Emirates",
    region: "middle-east",
    continent: "asia",
  },
  Singapore: {
    country: "Singapore",
    region: "southeast-asia",
    continent: "asia",
  },
  "Hong Kong": {
    country: "Hong Kong",
    region: "east-asia",
    continent: "asia",
  },
  Seoul: {
    country: "South Korea",
    region: "east-asia",
    continent: "asia",
  },
  Sydney: {
    country: "Australia",
    region: "australia-east",
    continent: "oceania",
  },
  Doha: {
    country: "Qatar",
    region: "middle-east",
    continent: "asia",
  },
  Brisbane: {
    country: "Australia",
    region: "australia-east",
    continent: "oceania",
  },
  Canberra: {
    country: "Australia",
    region: "australia-east",
    continent: "oceania",
  },
};

const routeKey = (fromCity, toCity) => {
  return [fromCity, toCity].sort().join("|");
};

export const FOCUS_DURATION_ROUTE_OVERRIDES = {
  [routeKey("Chicago", "New York")]: "SHORT_ROUTE",
  [routeKey("Lisbon", "Madrid")]: "SHORT_ROUTE",
  [routeKey("Paris", "Rome")]: "SHORT_ROUTE",

  [routeKey("Amsterdam", "Frankfurt")]: "REGIONAL_ROUTE",
  [routeKey("London", "Paris")]: "REGIONAL_ROUTE",
  [routeKey("New York", "Toronto")]: "REGIONAL_ROUTE",

  [routeKey("London", "Istanbul")]: "INTERNATIONAL_ROUTE",
  [routeKey("Paris", "Dubai")]: "INTERNATIONAL_ROUTE",
  [routeKey("Seoul", "Tokyo")]: "INTERNATIONAL_ROUTE",

  [routeKey("Dubai", "Singapore")]: "LONG_HAUL",
  [routeKey("New York", "London")]: "LONG_HAUL",
  [routeKey("Tokyo", "Vancouver")]: "LONG_HAUL",

  [routeKey("Dubai", "Toronto")]: "DEEP_FLIGHT",
  [routeKey("London", "Sydney")]: "DEEP_FLIGHT",
  [routeKey("Los Angeles", "Tokyo")]: "DEEP_FLIGHT",

  [routeKey("Los Angeles", "Sydney")]: "OCEANIC_FLOW",
  [routeKey("New York", "Tokyo")]: "OCEANIC_FLOW",
};

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

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const getFallbackDurationCategory = (fromCity, toCity) => {
  const fromProfile = FOCUS_DURATION_CITY_PROFILES[fromCity];
  const toProfile = FOCUS_DURATION_CITY_PROFILES[toCity];

  if (!fromProfile || !toProfile) {
    return "INTERNATIONAL_ROUTE";
  }

  if (fromProfile.country === toProfile.country) {
    return "SHORT_ROUTE";
  }

  if (fromProfile.region === toProfile.region) {
    return "REGIONAL_ROUTE";
  }

  const fromCoordinates = getCityCenterByName(fromCity);
  const toCoordinates = getCityCenterByName(toCity);

  if (!fromCoordinates || !toCoordinates) {
    return "INTERNATIONAL_ROUTE";
  }

  const distanceKm = getDistanceKm(fromCoordinates, toCoordinates);

  if (distanceKm <= 1800) {
    return "REGIONAL_ROUTE";
  }

  if (distanceKm <= 5000) {
    return "INTERNATIONAL_ROUTE";
  }

  if (distanceKm <= 8000) {
    return "LONG_HAUL";
  }

  if (distanceKm <= 11000) {
    return "DEEP_FLIGHT";
  }

  return "OCEANIC_FLOW";
};

export const getFocusDurationCategoryByCities = (fromCity, toCity) => {
  if (!fromCity || !toCity) {
    return null;
  }

  if (fromCity === toCity) {
    return "LOCAL_HOP";
  }

  return (
    FOCUS_DURATION_ROUTE_OVERRIDES[routeKey(fromCity, toCity)] ??
    getFallbackDurationCategory(fromCity, toCity)
  );
};

export const getFocusDurationByCities = (fromCity, toCity) => {
  const category = getFocusDurationCategoryByCities(fromCity, toCity);

  if (!category) {
    return null;
  }

  return {
    category,
    label: FOCUS_DURATION_LABELS[category],
    minutes: FOCUS_DURATION[category],
  };
};

export const getFocusDurationByAirports = (fromAirport, toAirport) => {
  return getFocusDurationByCities(fromAirport?.city, toAirport?.city);
};
