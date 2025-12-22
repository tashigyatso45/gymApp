import React, { useMemo, useState } from "react";
import AddReview from "./AddReview";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function GymByIdCard({ single, setSingle }) {
  // store which review IDs are expanded
  const [openReviews, setOpenReviews] = useState(() => new Set());

  const reviews = useMemo(() => single?.reviews ?? [], [single]);

  function toggleReview(reviewId) {
    setOpenReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="overflow-hidden">
        {single?.image ? (
          <img
            src={single.image}
            alt={single?.name || "Gym"}
            className="h-64 w-full object-cover"
          />
        ) : null}

        <CardHeader>
          <CardTitle className="text-2xl">{single?.name}</CardTitle>
          <CardDescription>
            {single?.location ? single.location : "Location not provided"}
          </CardDescription>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {single?.rating != null ? (
              <span className="rounded-md border px-2 py-1 text-sm text-muted-foreground">
                ⭐ {single.rating}
              </span>
            ) : (
              <span className="rounded-md border px-2 py-1 text-sm text-muted-foreground">
                No rating yet
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {single?.description ? single.description : "No description."}
          </p>
        </CardContent>
      </Card>

      {/* Reviews */}
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
            <p className="text-sm text-muted-foreground">
              {reviews.length
                ? "What people are saying"
                : "No reviews yet — be the first."}
            </p>
          </div>
        </div>

        {reviews.length ? (
          <div className="space-y-3">
            {reviews.map((review) => {
              const isOpen = openReviews.has(review.id);
              return (
                <Card key={review.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">
                          By: {review.name}
                        </CardTitle>
                        {review.rating != null ? (
                          <CardDescription>⭐ {review.rating}</CardDescription>
                        ) : (
                          <CardDescription>No rating</CardDescription>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-9"
                        onClick={() => toggleReview(review.id)}
                      >
                        {isOpen ? "Hide" : "Read"}
                      </Button>
                    </div>
                  </CardHeader>

                  {isOpen ? (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {review.review_description || "No review text."}
                      </p>
                    </CardContent>
                  ) : null}
                </Card>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Add Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add a review</CardTitle>
          <CardDescription>Share your experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddReview setSingle={setSingle} />
        </CardContent>
      </Card>
    </div>
  );
}
