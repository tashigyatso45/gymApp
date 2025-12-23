import React, { useEffect, useMemo, useState } from "react";
import Gym from "./Gym";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function EmptyDatabaseState() {
  return (
    <div className="rounded-lg border p-8 text-center">
      <p className="text-sm text-muted-foreground">No gyms yet.</p>
      <p className="mt-2 text-sm">
        Add your first gym or run your seed script to populate demo data.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href="/addgym"
          className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
        >
          Add a gym
        </a>
        <div className="text-xs text-muted-foreground sm:self-center">
          Tip: run <span className="font-mono">python seed.py</span>
        </div>
      </div>
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="rounded-lg border p-8 text-center">
      <p className="text-sm text-muted-foreground">
        No gyms match your search.
      </p>
      <p className="mt-2 text-sm">
        Try a different keyword (name, location, or description).
      </p>
    </div>
  );
}

function GymCard() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rating_desc"); // default sort

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const resp = await fetch("http://localhost:5555/gyms");
        if (!resp.ok) throw new Error(`Request failed: ${resp.status}`);

        const data = await resp.json();
        if (!cancelled) setGyms(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load gyms.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteGym = async (gymId) => {
    try {
      const resp = await fetch(`http://localhost:5555/gyms/${gymId}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        setGyms((prev) => prev.filter((g) => g.id !== gymId));
      } else {
        console.error("Failed to delete gym");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Filter + Sort (derived)
  const filteredGyms = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = gyms;

    if (q) {
      list = list.filter((g) => {
        const name = (g.name || "").toLowerCase();
        const location = (g.location || "").toLowerCase();
        const desc = (g.description || "").toLowerCase();
        return name.includes(q) || location.includes(q) || desc.includes(q);
      });
    }

    const sorted = [...list];

    sorted.sort((a, b) => {
      const ar = a.rating ?? -1;
      const br = b.rating ?? -1;

      if (sort === "rating_desc") return br - ar;
      if (sort === "rating_asc") return ar - br;

      if (sort === "name_asc")
        return (a.name || "").localeCompare(b.name || "");
      if (sort === "name_desc")
        return (b.name || "").localeCompare(a.name || "");

      return 0;
    });

    return sorted;
  }, [gyms, query, sort]);

  if (loading)
    return <div className="text-sm text-muted-foreground">Loading gyms...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Find a gym worth training at
          </h1>
          <p className="text-sm text-muted-foreground">
            Search by location, name, or vibe - sort by what matters to you
          </p>
        </div>

        {/* Sort buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={sort === "rating_desc" ? "default" : "outline"}
            onClick={() => setSort("rating_desc")}
          >
            Rating ↓
          </Button>
          <Button
            type="button"
            variant={sort === "rating_asc" ? "default" : "outline"}
            onClick={() => setSort("rating_asc")}
          >
            Rating ↑
          </Button>
          <Button
            type="button"
            variant={sort === "name_asc" ? "default" : "outline"}
            onClick={() => setSort("name_asc")}
          >
            Name A–Z
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, location, or description..."
          className="h-10"
        />
        <Button
          type="button"
          variant="secondary"
          className="h-10"
          onClick={() => setQuery("")}
        >
          Clear
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border px-3 py-2 text-sm">{error}</div>
      ) : null}

      {/* Results */}
      {gyms.length === 0 ? (
        <EmptyDatabaseState />
      ) : filteredGyms.length === 0 ? (
        <EmptySearchState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGyms.map((gymObj) => (
            <Gym
              key={gymObj.id}
              id={gymObj.id}
              name={gymObj.name}
              rating={gymObj.rating}
              location={gymObj.location}
              description={gymObj.description}
              image={gymObj.image}
              onDelete={handleDeleteGym}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GymCard;
