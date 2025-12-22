import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

function GymCard() {
  const [gyms, setGym] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5555/gyms")
      .then((resp) => resp.json())
      .then((gymData) => setGym(gymData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteGym = (gymId) => {
    fetch(`http://localhost:5555/gyms/${gymId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          setGym((prevGyms) => prevGyms.filter((gym) => gym.id !== gymId));
        } else {
          console.error("Failed to delete gym");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading gyms...</div>;
  }

  if (!gyms.length) {
    return <div className="text-sm text-muted-foreground">No gyms found.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {gyms.map((gym) => (
        <Card key={gym.id} className="overflow-hidden">
          {gym.image ? (
            <img
              src={gym.image}
              alt={gym.name}
              className="h-40 w-full object-cover"
            />
          ) : null}

          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{gym.name}</span>
              {gym.rating != null ? (
                <span className="text-sm font-medium text-muted-foreground">
                  ⭐ {gym.rating}
                </span>
              ) : null}
            </CardTitle>

            <CardDescription>
              {gym.location ? gym.location : "Location not provided"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {gym.description ? (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {gym.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No description.</p>
            )}
          </CardContent>

          <CardFooter className="justify-between gap-2">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to={`/gyms/${gym.id}`}>View</Link>
            </Button>

            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => handleDeleteGym(gym.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default GymCard;
