import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

function AddReview({ setSingle }) {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    rating: "",
    review_description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const reviewText = form.review_description.trim();

    if (!name) {
      setError("Name is required.");
      return;
    }
    if (!reviewText) {
      setError("Review text is required.");
      return;
    }

    // rating is optional; if provided, enforce 0–5 int
    let rating = null;
    if (form.rating !== "") {
      const n = Number(form.rating);
      if (!Number.isInteger(n) || n < 0 || n > 5) {
        setError("Rating must be an integer from 0 to 5.");
        return;
      }
      rating = n;
    }

    const payload = {
      name,
      rating, // null or int
      review_description: reviewText,
      gym_id: Number(id),
      user_id: null,
    };

    setIsSubmitting(true);

    try {
      const resp = await fetch("http://localhost:5555/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Request failed with status ${resp.status}`);
      }

      const createdReview = await resp.json();

      // Safely append the new review to the current gym’s reviews
      setSingle((current) => {
        const existing = Array.isArray(current?.reviews) ? current.reviews : [];
        return { ...current, reviews: [...existing, createdReview] };
      });

      // Clear form
      setForm({ name: "", rating: "", review_description: "" });
    } catch (err) {
      setError(err.message || "Failed to add review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error ? (
        <div className="rounded-md border px-3 py-2 text-sm">{error}</div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Your name</label>
          <Input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g., Tashi"
            autoComplete="off"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Rating (optional)</label>
          <Input
            name="rating"
            value={form.rating}
            onChange={onChange}
            placeholder="0–5"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Review</label>
        <Textarea
          name="review_description"
          value={form.review_description}
          onChange={onChange}
          placeholder="What did you like/dislike?"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Add Review"}
      </Button>
    </form>
  );
}

export default AddReview;
