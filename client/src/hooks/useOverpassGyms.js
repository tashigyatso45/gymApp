import { useCallback, useEffect, useState } from "react";
import { assignBorough } from "../lib/boroughUtils";

const cache = new Map(); // key -> { gyms, timestamp }
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const NYC_QUERY = `[out:json][timeout:30];
(
  node["leisure"="fitness_centre"](40.4774,-74.2591,40.9176,-73.7004);
  way["leisure"="fitness_centre"](40.4774,-74.2591,40.9176,-73.7004);
  node["amenity"="gym"](40.4774,-74.2591,40.9176,-73.7004);
  way["amenity"="gym"](40.4774,-74.2591,40.9176,-73.7004);
);
out center tags;`;

function normalize(element) {
  const tags = element.tags || {};
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;

  const city =
    tags["addr:city"] ||
    tags["addr:suburb"] ||
    tags["addr:borough"] ||
    "";

  const gym = {
    osmId: `${element.type || "node"}-${element.id}`,
    name: tags.name || "",
    address: [tags["addr:housenumber"], tags["addr:street"]]
      .filter(Boolean)
      .join(" "),
    city,
    lat,
    lng,
    website: tags.website || tags["contact:website"] || "",
    phone: tags.phone || tags["contact:phone"] || "",
    hours: tags["opening_hours"] || "",
  };

  gym.borough = assignBorough(gym);
  return gym;
}

async function fetchGyms(query) {
  const resp = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  if (!resp.ok) throw new Error(`Overpass error: ${resp.status}`);
  const data = await resp.json();
  return (data.elements || [])
    .map(normalize)
    .filter((g) => g.name.trim() !== "");
}

export function useOverpassGyms() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const cached = cache.get("nyc");
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (!cancelled) {
          setGyms(cached.gyms);
          setLoading(false);
        }
        return;
      }

      try {
        const result = await fetchGyms(NYC_QUERY);
        cache.set("nyc", { gyms: result, timestamp: Date.now() });
        if (!cancelled) setGyms(result);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load gyms.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [retryCount]);

  const retry = useCallback(() => {
    cache.delete("nyc");
    setRetryCount((c) => c + 1);
  }, []);

  return { gyms, loading, error, retry };
}
