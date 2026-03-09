import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Gym from "./Gym";
import OSMGymCard from "./OSMGymCard";
import { useOverpassGyms } from "../hooks/useOverpassGyms";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const BOROUGH_TABS = ["All NYC", "Manhattan", "Brooklyn", "Queens", "Bronx"];

const BOROUGH_SLUG_MAP = {
  manhattan: "Manhattan",
  brooklyn: "Brooklyn",
  queens: "Queens",
  bronx: "Bronx",
  "staten-island": "Staten Island",
};

function SkeletonCard() {
  return (
    <div className="border border-border p-5 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
      <div className="h-3 bg-muted rounded w-1/2 mb-2" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  );
}

function GymCard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeBorough, setActiveBorough] = useState(() => {
    const slug = searchParams.get("borough");
    return slug ? (BOROUGH_SLUG_MAP[slug] || "All NYC") : "All NYC";
  });

  // OSM gyms
  const { gyms: osmGyms, loading, error, retry } = useOverpassGyms();

  // Flask DB gyms
  const [dbGyms, setDbGyms] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5555/gyms")
      .then((r) => r.json())
      .then((data) => setDbGyms(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setDbLoading(false));
  }, []);

  const handleDeleteGym = async (gymId) => {
    try {
      const resp = await fetch(`http://localhost:5555/gyms/${gymId}`, { method: "DELETE" });
      if (resp.ok) setDbGyms((prev) => prev.filter((g) => g.id !== gymId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Sync borough tab → URL
  const handleBoroughChange = (tab) => {
    setActiveBorough(tab);
    if (tab === "All NYC") {
      setSearchParams((prev) => { prev.delete("borough"); return prev; });
    } else {
      setSearchParams((prev) => {
        prev.set("borough", tab.toLowerCase().replace(/ /g, "-"));
        return prev;
      });
    }
  };

  const filteredGyms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return osmGyms.filter((g) => {
      const boroughMatch =
        activeBorough === "All NYC" || g.borough === activeBorough;
      const textMatch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.address.toLowerCase().includes(q);
      return boroughMatch && textMatch;
    });
  }, [osmGyms, activeBorough, query]);

  return (
    <div>
      {/* Dark header bar */}
      <div className="bg-foreground text-primary-foreground py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
            OpenStreetMap · Live Data
          </p>
          <h1 className="text-3xl md:text-4xl text-white">NYC Gym Directory</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Borough tabs */}
        <div className="flex flex-wrap gap-0 border-b border-border">
          {BOROUGH_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleBoroughChange(tab)}
              className={`px-5 py-3 text-sm uppercase tracking-widest transition-colors ${
                activeBorough === tab
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 max-w-lg">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or address…"
            className="h-10"
          />
          {query && (
            <Button variant="outline" onClick={() => setQuery("")} className="h-10">
              Clear
            </Button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Fetching live data from OpenStreetMap…
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="border border-border p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={retry}>
              Retry
            </Button>
          </div>
        )}

        {/* OSM Gym grid */}
        {!loading && !error && (
          <>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {filteredGyms.length} {filteredGyms.length === 1 ? "gym" : "gyms"} found
            </p>
            {filteredGyms.length === 0 ? (
              <div className="border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No gyms match your filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGyms.map((gym) => (
                  <OSMGymCard key={gym.osmId} gym={gym} />
                ))}
              </div>
            )}
          </>
        )}

        {/* My Submissions collapsible */}
        <div className="border-t border-border pt-8">
          <button
            className="flex items-center gap-3 text-sm uppercase tracking-widest text-foreground mb-4 w-full text-left"
            onClick={() => setShowSubmissions((v) => !v)}
          >
            <span>My Submissions</span>
            {!dbLoading && (
              <span className="text-muted-foreground">({dbGyms.length})</span>
            )}
            <span className="ml-auto text-muted-foreground">
              {showSubmissions ? "▲" : "▼"}
            </span>
          </button>

          {showSubmissions && (
            dbLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : dbGyms.length === 0 ? (
              <div className="border border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
                <a
                  href="/addgym"
                  className="text-xs uppercase tracking-widest underline underline-offset-2 mt-2 inline-block"
                >
                  Add a gym
                </a>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dbGyms.map((g) => (
                  <Gym
                    key={g.id}
                    id={g.id}
                    name={g.name}
                    rating={g.rating}
                    location={g.location}
                    description={g.description}
                    image={g.image}
                    onDelete={handleDeleteGym}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default GymCard;
