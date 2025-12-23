import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const [gyms, setGyms] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [errorTop, setErrorTop] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/gyms?q=${encodeURIComponent(query)}` : "/gyms");
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingTop(true);
      setErrorTop("");

      try {
        const resp = await fetch("http://localhost:5555/gyms");
        if (!resp.ok) throw new Error(`Request failed: ${resp.status}`);
        const data = await resp.json();
        if (!cancelled) setGyms(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErrorTop(e.message || "Failed to load gyms.");
      } finally {
        if (!cancelled) setLoadingTop(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const top3 = useMemo(() => {
    return [...gyms]
      .filter((g) => g.rating !== null && g.rating !== undefined)
      .sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
      .slice(0, 3);
  }, [gyms]);

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="rounded-2xl border bg-background">
        <div className="px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">
              GymFinder (Demo)
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Find a gym worth training at.
            </h1>

            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Browse gyms, check ratings, and add reviews. Built with React,
              Tailwind, shadcn/ui, Flask, and SQLite.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild className="h-10">
                <Link to="/gyms">Browse gyms</Link>
              </Button>

              <Button asChild variant="outline" className="h-10">
                <Link to="/addgym">Add a gym</Link>
              </Button>
            </div>

            <form onSubmit={handleSearch} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or location…"
                  className="h-10"
                />
                <Button type="submit" variant="secondary" className="h-10">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TOP RATED */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Top Rated Gyms
            </h2>
            <p className="text-sm text-muted-foreground">
              Based on your current database ratings.
            </p>
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link to="/gyms">View all</Link>
          </Button>
        </div>

        {loadingTop ? (
          <div className="text-sm text-muted-foreground">
            Loading top gyms...
          </div>
        ) : errorTop ? (
          <div className="rounded-lg border p-4 text-sm">{errorTop}</div>
        ) : top3.length === 0 ? (
          <div className="rounded-lg border p-6 text-center">
            <p className="text-sm text-muted-foreground">No rated gyms yet.</p>
            <p className="mt-2 text-sm">
              Add a gym with a rating, or run your seed script.
            </p>
            <Button asChild className="mt-4">
              <Link to="/addgym">Add a gym</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {top3.map((g) => (
              <Card
                key={g.id}
                className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {g.image ? (
                  <img
                    src={g.image}
                    alt={g.name}
                    className="h-40 w-full object-cover"
                  />
                ) : null}

                <CardHeader className="space-y-1">
                  <CardTitle className="truncate">{g.name}</CardTitle>
                  <CardDescription>
                    {g.location || "Location not provided"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    ⭐ {g.rating}/5
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {g.description || "No description."}
                  </p>

                  <Button asChild className="w-full" variant="outline">
                    <Link to={`/gyms/${g.id}`}>View details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
