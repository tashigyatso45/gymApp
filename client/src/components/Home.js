import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const query = q.trim();
    // Later: read this query param on the /gyms page to filter results
    navigate(query ? `/gyms?q=${encodeURIComponent(query)}` : "/gyms");
  }

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
              Find your next gym — fast.
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

            {/* Quick search */}
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
              <p className="mt-2 text-xs text-muted-foreground">
                Tip: try “Albany”, “Bronx”, or a gym name from your seed data.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium">Browse</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore gyms in a clean card layout with ratings and details.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium">Review</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Leave feedback and help others pick the right spot to train.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium">Save time</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick search + simple UX so you get to the info immediately.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
