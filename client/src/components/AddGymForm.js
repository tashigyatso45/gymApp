import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function AddGymForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    rating: "",
    image: "",
    location: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ratingNumber = useMemo(() => {
    if (form.rating === "") return null;
    const n = Number(form.rating);
    return Number.isFinite(n) ? n : null;
  }, [form.rating]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.name.trim()) {
      setError("Gym name is required.");
      return;
    }
    if (
      ratingNumber !== null &&
      (!Number.isInteger(ratingNumber) || ratingNumber < 0 || ratingNumber > 5)
    ) {
      setError("Rating must be an integer from 0 to 5.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      rating: ratingNumber, // int or null
      image: form.image.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
    };

    setIsSubmitting(true);

    try {
      const resp = await fetch("http://localhost:5555/gyms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Request failed with status ${resp.status}`);
      }

      // If you want the created gym:
      // const created = await resp.json();

      navigate("/gyms");
    } catch (err) {
      setError(err.message || "Error adding gym.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Add a Gym</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-md border px-3 py-2 text-sm">{error}</div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium">Gym Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g., Iron Temple Gym"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating (0–5)</label>
              <Input
                name="rating"
                value={form.rating}
                onChange={onChange}
                placeholder="e.g., 4"
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="e.g., Albany, NY"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              name="image"
              value={form.image}
              onChange={onChange}
              placeholder="https://..."
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="What’s special about this gym?"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Gym"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/gyms")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AddGymForm;
