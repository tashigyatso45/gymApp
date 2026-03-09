import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BoroughSection from "./BoroughSection";
import { assignBorough } from "../lib/boroughUtils";

const BOROUGH_CONFIG = [
  {
    name: "Manhattan",
    description:
      "From the steel-and-glass towers of Midtown to the boutique studios of the West Village, Manhattan sets the standard for urban fitness.",
    photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
    slug: "manhattan",
  },
  {
    name: "Brooklyn",
    description:
      "Brooklyn's fitness culture is as eclectic as its neighborhoods — warehouses converted to CrossFit boxes, rooftop yoga, and everything between.",
    photoUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80",
    slug: "brooklyn",
  },
  {
    name: "Queens",
    description:
      "The most diverse borough in the world brings equally diverse training options, from martial arts dojos to Olympic-standard track facilities.",
    photoUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
    slug: "queens",
  },
  {
    name: "Bronx",
    description:
      "Birthplace of hip-hop and home to championship athletes, the Bronx carries a legacy of grit and determination into every gym.",
    photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    slug: "bronx",
  },
];

const BOROUGH_QUERIES = {
  manhattan: `[out:json][timeout:25];(node["leisure"="fitness_centre"](40.6981,-74.0479,40.8820,-73.9072);way["leisure"="fitness_centre"](40.6981,-74.0479,40.8820,-73.9072);node["amenity"="gym"](40.6981,-74.0479,40.8820,-73.9072);way["amenity"="gym"](40.6981,-74.0479,40.8820,-73.9072););out count;`,
  brooklyn:  `[out:json][timeout:25];(node["leisure"="fitness_centre"](40.5707,-74.0431,40.7394,-73.8333);way["leisure"="fitness_centre"](40.5707,-74.0431,40.7394,-73.8333);node["amenity"="gym"](40.5707,-74.0431,40.7394,-73.8333);way["amenity"="gym"](40.5707,-74.0431,40.7394,-73.8333););out count;`,
  queens:    `[out:json][timeout:25];(node["leisure"="fitness_centre"](40.5431,-73.9626,40.8007,-73.7004);way["leisure"="fitness_centre"](40.5431,-73.9626,40.8007,-73.7004);node["amenity"="gym"](40.5431,-73.9626,40.8007,-73.7004);way["amenity"="gym"](40.5431,-73.9626,40.8007,-73.7004););out count;`,
  bronx:     `[out:json][timeout:25];(node["leisure"="fitness_centre"](40.7856,-73.9338,40.9176,-73.7654);way["leisure"="fitness_centre"](40.7856,-73.9338,40.9176,-73.7654);node["amenity"="gym"](40.7856,-73.9338,40.9176,-73.7654);way["amenity"="gym"](40.7856,-73.9338,40.9176,-73.7654););out count;`,
};

async function fetchBoroughCount(query) {
  const resp = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  const total = data.elements?.find((e) => e.type === "count");
  return total ? Number(total.tags?.total) : null;
}

export default function Home() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const entries = Object.entries(BOROUGH_QUERIES);
    Promise.all(
      entries.map(([borough, query]) =>
        fetchBoroughCount(query).then((count) => [borough, count])
      )
    ).then((results) => {
      const map = {};
      results.forEach(([borough, count]) => {
        map[borough] = count;
      });
      setCounts(map);
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-end">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
          alt="NYC gym"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-4">
            New York City Gym Directory
          </p>
          <h1 className="text-5xl md:text-7xl text-white leading-tight mb-6 max-w-2xl">
            Every gym.<br />Every borough.
          </h1>
          <div className="flex gap-6">
            <Link
              to="/gyms"
              className="text-sm uppercase tracking-widest border border-white text-white px-6 py-3 hover:bg-white hover:text-foreground transition-colors"
            >
              Browse All Gyms
            </Link>
            <Link
              to="/addgym"
              className="text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors self-center"
            >
              Add a Gym →
            </Link>
          </div>
        </div>
      </section>

      {/* Borough Sections */}
      <div>
        {BOROUGH_CONFIG.map((b, i) => (
          <BoroughSection
            key={b.name}
            name={b.name}
            description={b.description}
            photoUrl={b.photoUrl}
            gymCount={counts[b.slug]}
            reversed={i % 2 !== 0}
          />
        ))}
      </div>

      {/* Footer strip */}
      <div className="border-t py-10 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Data sourced from OpenStreetMap contributors · Updated live
        </p>
      </div>
    </div>
  );
}
