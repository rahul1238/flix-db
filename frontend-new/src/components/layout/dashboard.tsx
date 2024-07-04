import { Outlet, useNavigate } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import { useEffect, useRef } from "react";
import { useUser } from "@/providers/user";
import autoAnimate from '@formkit/auto-animate'


export default function DashboardLayout() {
  const { user } = useUser();
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) navigate('/login');
  // }, [user])
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current, {
      duration: 150
    })
  }, [parent])

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main ref={parent} className="flex-1 overflow-hidden pt-24 px-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
