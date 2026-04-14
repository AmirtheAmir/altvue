import { cityDatabase } from "./cityDatabase";

const SUPPORTED_CONTINENTS = new Set(["America", "Europe"]);

export const airportCatalog = cityDatabase.flatMap((cityRecord) =>
  cityRecord.airports.map((airport) => ({
    ...airport,
    city: cityRecord.city,
    country: cityRecord.country,
    continent: cityRecord.continent,
  })),
);

export const airportByCode = airportCatalog.reduce((acc, airport) => {
  acc[airport.code] = airport;
  return acc;
}, {});

const resolveDurationMinutes = (fromAirport, toAirport) => {
  if (!fromAirport || !toAirport || fromAirport.code === toAirport.code) {
    return null;
  }

  const isFromSupported = SUPPORTED_CONTINENTS.has(fromAirport.continent);
  const isToSupported = SUPPORTED_CONTINENTS.has(toAirport.continent);

  if (!isFromSupported || !isToSupported) {
    return null;
  }

  if (fromAirport.continent === toAirport.continent) {
    return 30;
  }

  return 60;
};

export const routeDurationDatabase = airportCatalog.flatMap((fromAirport) =>
  airportCatalog
    .filter((toAirport) => toAirport.code !== fromAirport.code)
    .map((toAirport) => {
      const durationMinutes = resolveDurationMinutes(fromAirport, toAirport);

      if (!durationMinutes) {
        return null;
      }

      return {
        id: `${fromAirport.code}-${toAirport.code}`,
        from: {
          code: fromAirport.code,
          city: fromAirport.city,
          country: fromAirport.country,
          airportName: fromAirport.name,
          continent: fromAirport.continent,
        },
        to: {
          code: toAirport.code,
          city: toAirport.city,
          country: toAirport.country,
          airportName: toAirport.name,
          continent: toAirport.continent,
        },
        durationMinutes,
        durationLabel: `${durationMinutes}:00`,
      };
    })
    .filter(Boolean),
);

const routeById = routeDurationDatabase.reduce((acc, routeRecord) => {
  acc[routeRecord.id] = routeRecord;
  return acc;
}, {});

export const durationOptionsMinutes = [30, 60];

export const getRouteDurationByCodes = (fromCode, toCode) => {
  if (!fromCode || !toCode) {
    return null;
  }

  return routeById[`${fromCode}-${toCode}`] || null;
};

export const getRoutesByDuration = (durationMinutes) =>
  routeDurationDatabase.filter(
    (routeRecord) => routeRecord.durationMinutes === durationMinutes,
  );
