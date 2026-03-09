import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/gyms", label: "All Gyms" },
  { to: "/addgym", label: "Add Gym" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <NavLink
          to="/"
          className="text-sm font-medium uppercase tracking-widest text-foreground"
        >
          NYC GYMS
        </NavLink>

        {/* Links */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"}>
              {({ isActive }) => (
                <span
                  className={`text-sm uppercase tracking-widest transition-colors ${
                    isActive
                      ? "border-b border-foreground text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
