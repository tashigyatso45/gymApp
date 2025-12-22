import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import GymByIdCard from "./GymByIdCard";

function GymById() {
  const { id } = useParams();

  const [single, setSingle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const resp = await fetch(`http://localhost:5555/gyms/${id}`);

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || `Request failed with status ${resp.status}`);
        }

        const data = await resp.json();
        if (!cancelled) setSingle(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load gym.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading gym...</div>;
  }

  if (error) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Couldn’t load gym</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{error}</p>
          <Button asChild variant="outline">
            <Link to="/gyms">Back to gyms</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!single) {
    return <div className="text-sm text-muted-foreground">Gym not found.</div>;
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="outline">
        <Link to="/gyms">← Back to gyms</Link>
      </Button>

      <GymByIdCard single={single} setSingle={setSingle} />
    </div>
  );
}

export default GymById;
