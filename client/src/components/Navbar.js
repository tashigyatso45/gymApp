import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/gyms", label: "All Gyms" },
  { to: "/addgym", label: "Add Gym" },
];

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left: Brand */}
        <NavLink to="/" className="text-lg font-semibold tracking-tight">
          GymFinder
        </NavLink>

        {/* Right: Links */}
        <nav className="flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="h-9"
                >
                  {link.label}
                </Button>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
