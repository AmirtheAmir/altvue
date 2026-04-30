import { supabase } from "./supabaseClient";

const normalizeAirport = (airport) => {
  return {
    code: airport.code,
    coordinates: airport.coordinates,
  };
};

const normalizeCity = (city) => {
  return {
    ...city,
    airports: Array.isArray(city.airports)
      ? city.airports.map(normalizeAirport)
      : [],
  };
};

export const fetchCities = async () => {
  const { data, error } = await supabase
    .from("cities")
    .select("id, city, country, continent, airports")
    .order("city", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeCity);
};

const getAverageCoordinate = (airports, coordinateIndex) => {
  if (!airports?.length) {
    return null;
  }

  const total = airports.reduce((sum, airport) => {
    return sum + airport.coordinates[coordinateIndex];
  }, 0);

  return total / airports.length;
};

export const getCityCenterByName = (cities, cityName) => {
  if (!cityName) {
    return null;
  }

  const cityItem = cities?.find((item) => item.city === cityName);

  if (!cityItem?.airports?.length) {
    return null;
  }

  return [
    getAverageCoordinate(cityItem.airports, 0),
    getAverageCoordinate(cityItem.airports, 1),
  ];
};

export const getCityCenterByAirport = (cities, airport) => {
  return (
    getCityCenterByName(cities, airport?.city) ?? airport?.coordinates ?? null
  );
};
