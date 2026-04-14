export const cityDatabase = [
  {
    city: "New York",
    country: "USA",
    continent: "America",
    airports: [
      {
        name: "John F. Kennedy International Airport",
        code: "JFK",
        coordinates: [-73.7781, 40.6413],
      },
      {
        name: "LaGuardia Airport",
        code: "LGA",
        coordinates: [-73.874, 40.7769],
      },
    ],
  },
  {
    city: "London",
    country: "United Kingdom",
    continent: "Europe",
    airports: [
      {
        name: "Heathrow Airport",
        code: "LHR",
        coordinates: [-0.4543, 51.47],
      },
      {
        name: "Gatwick Airport",
        code: "LGW",
        coordinates: [-0.1903, 51.1537],
      },
    ],
  },
  {
    city: "Paris",
    country: "France",
    continent: "Europe",
    airports: [
      {
        name: "Charles de Gaulle Airport",
        code: "CDG",
        coordinates: [2.5479, 49.0097],
      },
      {
        name: "Orly Airport",
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
        name: "Haneda Airport",
        code: "HND",
        coordinates: [139.7798, 35.5494],
      },
      {
        name: "Narita International Airport",
        code: "NRT",
        coordinates: [140.3929, 35.772],
      },
    ],
  },
  {
    city: "Lisbon",
    country: "Portugal",
    continent: "Europe",
    airports: [
      {
        name: "Humberto Delgado Airport",
        code: "LIS",
        coordinates: [-9.1359, 38.7742],
      },
    ],
  },
];

export const defaultRoute = {
  from: {
    city: "New York",
    airportCode: "JFK",
  },
  to: {
    city: "Lisbon",
    airportCode: "LIS",
  },
};
