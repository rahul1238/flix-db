import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16"><Outlet /></main>
      </div>
    </>
  );
}
