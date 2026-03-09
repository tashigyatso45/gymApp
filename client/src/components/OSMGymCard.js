import React from "react";

const BOROUGH_COLORS = {
  Manhattan: "bg-stone-800 text-stone-100",
  Brooklyn: "bg-amber-900 text-amber-50",
  Queens: "bg-slate-700 text-slate-100",
  Bronx: "bg-neutral-700 text-neutral-100",
  "Staten Island": "bg-zinc-700 text-zinc-100",
  Other: "bg-gray-600 text-gray-100",
};

export default function OSMGymCard({ gym }) {
  const badgeClass = BOROUGH_COLORS[gym.borough] || BOROUGH_COLORS.Other;

  return (
    <div className="border border-border bg-background p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground leading-snug">{gym.name}</h3>
        <span className={`shrink-0 text-xs uppercase tracking-wider px-2 py-0.5 ${badgeClass}`}>
          {gym.borough}
        </span>
      </div>

      {gym.address && (
        <p className="text-sm text-muted-foreground">{gym.address}</p>
      )}

      {gym.hours && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Hours:</span> {gym.hours}
        </p>
      )}

      {gym.website && (
        <a
          href={gym.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors mt-auto"
        >
          Visit website →
        </a>
      )}
    </div>
  );
}
