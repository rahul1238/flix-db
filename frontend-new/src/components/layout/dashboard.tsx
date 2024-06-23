import { Outlet, useNavigate } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useUser } from "@/providers/user";

export default function DashboardLayout() {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user])
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-24 px-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
