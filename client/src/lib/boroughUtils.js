const BOROUGH_BOXES = {
  Manhattan: { minLat: 40.6981, maxLat: 40.8820, minLng: -74.0479, maxLng: -73.9072 },
  Brooklyn:  { minLat: 40.5707, maxLat: 40.7394, minLng: -74.0431, maxLng: -73.8333 },
  Queens:    { minLat: 40.5431, maxLat: 40.8007, minLng: -73.9626, maxLng: -73.7004 },
  Bronx:     { minLat: 40.7856, maxLat: 40.9176, minLng: -73.9338, maxLng: -73.7654 },
  "Staten Island": { minLat: 40.4774, maxLat: 40.6501, minLng: -74.2591, maxLng: -74.0522 },
};

const CITY_TAG_MAP = {
  brooklyn: "Brooklyn",
  bronx: "Bronx",
  queens: "Queens",
  "staten island": "Staten Island",
  manhattan: "Manhattan",
  "new york": "Manhattan",
  "new york city": "Manhattan",
  nyc: "Manhattan",
};

export function assignBorough(gym) {
  const cityTag = (gym.city || "").trim().toLowerCase();
  if (cityTag && CITY_TAG_MAP[cityTag]) {
    return CITY_TAG_MAP[cityTag];
  }

  const lat = gym.lat;
  const lng = gym.lng;
  if (lat == null || lng == null) return "Other";

  for (const [borough, box] of Object.entries(BOROUGH_BOXES)) {
    if (lat >= box.minLat && lat <= box.maxLat && lng >= box.minLng && lng <= box.maxLng) {
      return borough;
    }
  }

  return "Other";
}
