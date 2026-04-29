export const cityDatabase = [
  {
    city: "New York",
    country: "United States America",
    airports: [
      {
        code: "JFK",
        coordinates: [-73.7781, 40.6413],
      },
      {
        code: "LGA",
        coordinates: [-73.874, 40.7769],
      },
    ],
  },
  {
    city: "London",
    country: "United Kingdom",
    airports: [
      {
        code: "LHR",
        coordinates: [-0.4543, 51.47],
      },
      {
        code: "LGW",
        coordinates: [-0.1903, 51.1537],
      },
    ],
  },
  {
    city: "Paris",
    country: "France",
    airports: [
      {
        code: "CDG",
        coordinates: [2.5479, 49.0097],
      },
      {
        code: "ORY",
        coordinates: [2.3794, 48.7262],
      },
    ],
  },
  {
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    airports: [
      {
        code: "HND",
        coordinates: [139.7798, 35.5494],
      },
      {
        code: "NRT",
        coordinates: [140.3929, 35.772],
      },
    ],
  },
  {
    city: "Lisbon",
    country: "Portugal",
    airports: [
      {
        code: "LIS",
        coordinates: [-9.1359, 38.7742],
      },
    ],
  },
  {
    city: "Frankfurt",
    country: "Germany",
    airports: [
      {
        code: "FRA",
        coordinates: [8.5706, 50.0379],
      },
    ],
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    airports: [
      {
        code: "AMS",
        coordinates: [4.7634, 52.3086],
      },
    ],
  },
  {
    city: "Madrid",
    country: "Spain",
    airports: [
      {
        code: "MAD",
        coordinates: [-3.5676, 40.4983],
      },
    ],
  },
  {
    city: "Rome",
    country: "Italy",
    airports: [
      {
        code: "FCO",
        coordinates: [12.2508, 41.8003],
      },
      {
        code: "CIA",
        coordinates: [12.5949, 41.7999],
      },
    ],
  },
  {
    city: "Istanbul",
    country: "Turkey",
    airports: [
      {
        code: "IST",
        coordinates: [28.7519, 41.2753],
      },
      {
        code: "SAW",
        coordinates: [29.3092, 40.8986],
      },
    ],
  },
  {
    city: "Los Angeles",
    country: "United States America",
    airports: [
      {
        code: "LAX",
        coordinates: [-118.4085, 33.9416],
      },
      {
        code: "BUR",
        coordinates: [-118.3587, 34.2007],
      },
    ],
  },
  {
    city: "Chicago",
    country: "United States America",
    airports: [
      {
        code: "ORD",
        coordinates: [-87.9073, 41.9742],
      },
      {
        code: "MDW",
        coordinates: [-87.7524, 41.7868],
      },
    ],
  },
  {
    city: "Toronto",
    country: "Canada",
    airports: [
      {
        code: "YYZ",
        coordinates: [-79.6306, 43.6777],
      },
      {
        code: "YTZ",
        coordinates: [-79.3962, 43.6275],
      },
    ],
  },
  {
    city: "Vancouver",
    country: "Canada",
    airports: [
      {
        code: "YVR",
        coordinates: [-123.1815, 49.1947],
      },
    ],
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    airports: [
      {
        code: "DXB",
        coordinates: [55.3644, 25.2532],
      },
      {
        code: "DWC",
        coordinates: [55.1614, 24.8964],
      },
    ],
  },
  {
    city: "Singapore",
    country: "Singapore",
    airports: [
      {
        code: "SIN",
        coordinates: [103.994, 1.3644],
      },
    ],
  },
  {
    city: "Hong Kong",
    country: "Hong Kong",
    airports: [
      {
        code: "HKG",
        coordinates: [113.9185, 22.308],
      },
    ],
  },
  {
    city: "Seoul",
    country: "South Korea",
    airports: [
      {
        code: "ICN",
        coordinates: [126.4505, 37.4602],
      },
      {
        code: "GMP",
        coordinates: [126.791, 37.5583],
      },
    ],
  },
  {
    city: "Sydney",
    country: "Australia",
    airports: [
      {
        code: "SYD",
        coordinates: [151.1772, -33.9399],
      },
    ],
  },
  {
    city: "Doha",
    country: "Qatar",
    airports: [
      {
        code: "DOH",
        coordinates: [51.6138, 25.2731],
      },
    ],
  },
  {
    city: "Brisbane",
    country: "Australia",
    airports: [
      {
        code: "BNE",
        coordinates: [153.1175, -27.3842],
      },
    ],
  },
  {
    city: "Canberra",
    country: "Australia",
    airports: [
      {
        code: "CBR",
        coordinates: [149.1948, -35.3069],
      },
    ],
  },
];

const getAverageCoordinate = (airports, coordinateIndex) => {
  if (!airports?.length) {
    return null;
  }

  const total = airports.reduce((sum, airport) => {
    return sum + airport.coordinates[coordinateIndex];
  }, 0);

  return total / airports.length;
};

export const getCityCenterByName = (cityName) => {
  if (!cityName) {
    return null;
  }

  const cityItem = cityDatabase.find((item) => item.city === cityName);

  if (!cityItem?.airports?.length) {
    return null;
  }

  return [
    getAverageCoordinate(cityItem.airports, 0),
    getAverageCoordinate(cityItem.airports, 1),
  ];
};

export const getCityCenterByAirport = (airport) => {
  return getCityCenterByName(airport?.city) ?? airport?.coordinates ?? null;
};
