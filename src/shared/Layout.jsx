import { Outlet } from "react-router";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FAF9F4] dark:bg-[#121815] text-[#16221D] dark:text-[#EFEDE4] font-sans antialiased">
      {/* Sticky Top Navigation */}
      <Header />
      <Outlet />
    </div>
  );
}
