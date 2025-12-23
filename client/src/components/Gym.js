import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

function Gym({ id, name, rating, location, description, image, onDelete }) {
  const [showDescription, setShowDescription] = useState(false);

  const handleDelete = () => {
    onDelete?.(id);
  };

  return (
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {image ? (
        <button
          type="button"
          onClick={() => setShowDescription((prev) => !prev)}
          className="block w-full"
          title="Toggle description"
        >
          <img src={image} alt={name} className="h-40 w-full object-cover" />
        </button>
      ) : null}

      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate">{name}</span>
          {rating != null ? (
            <span className="text-sm font-medium text-muted-foreground">
              ⭐ {rating}
            </span>
          ) : null}
        </CardTitle>

        <CardDescription>
          {location ? location : "Location not provided"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {showDescription ? (
          <p className="text-sm text-muted-foreground">
            {description || "No description."}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description || "No description."}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to={`/gyms/${id}`}>View Gym</Link>
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            if (window.confirm("Remove this gym?")) {
              onDelete(id);
            }
          }}
        >
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Gym;
