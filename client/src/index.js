import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./components/Home";
import GymCard from "./components/GymCard";
import AddGymForm from "./components/AddGymForm";
import GymById from "./components/GymById";
import AddReview from "./components/AddReview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "gyms", element: <GymCard /> },
      { path: "addgym", element: <AddGymForm /> },
      { path: "gyms/:id", element: <GymById /> },
      { path: "reviews", element: <AddReview /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
