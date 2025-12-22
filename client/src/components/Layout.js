import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foregroud">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};



export default Layout;