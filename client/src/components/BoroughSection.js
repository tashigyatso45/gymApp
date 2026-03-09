import React from "react";
import { Link } from "react-router-dom";

export default function BoroughSection({ name, description, photoUrl, gymCount, reversed }) {
  const slug = name.toLowerCase().replace(/ /g, "-");

  return (
    <section className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} min-h-[420px]`}>
      {/* Photo */}
      <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Text */}
      <div className="md:w-1/2 bg-secondary flex flex-col justify-center px-10 py-12 gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            New York City
          </p>
          <h2 className="text-4xl md:text-5xl text-foreground leading-tight">{name}</h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          {description}
        </p>

        <div className="flex items-center gap-6">
          {gymCount != null && (
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {gymCount} {gymCount === 1 ? "gym" : "gyms"} listed
            </p>
          )}
          <Link
            to={`/gyms?borough=${encodeURIComponent(slug)}`}
            className="text-xs uppercase tracking-widest border-b border-foreground pb-0.5 text-foreground hover:text-muted-foreground transition-colors"
          >
            Explore {name} →
          </Link>
        </div>
      </div>
    </section>
  );
}
