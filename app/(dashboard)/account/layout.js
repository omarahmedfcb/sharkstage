'use client';


import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

const rolePermissions = {
  investor: ["/account", "/account/messages", "/account/offers", "/account/profile"],
  owner: [
    "/account",
    "/account/projects",
    "/account/messages",
    "/account/offers",
    "/account/profile",
  ],
  admin: [
    "/account",
    "/account/projects",
    "/account/messages",
    "/account/offers",
    "/account/profile",
    "/account/admin",
  ],
};

function isRouteAllowed(role, pathname) {
  const allowedRoutes = rolePermissions[role] ?? rolePermissions.investor;
  return allowedRoutes.some((route) => {
    if (route === pathname) return true;
    return pathname.startsWith(`${route}/`);
  });
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoggedIn, loading } = useSelector((state) => state.auth);

  const role = currentUser?.accountType ?? "investor";
  const routeAllowed = useMemo(() => isRouteAllowed(role, pathname), [role, pathname]);

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.replace(`/sign/in?redirect=${encodeURIComponent(pathname)}`);
    } else if (!routeAllowed) {
      router.replace("/account");
    }
  }, [isLoggedIn, loading, routeAllowed, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-heading">
        <div className="rounded-3xl border border-primary/10 bg-white/90 px-6 py-4 shadow">
          Checking your SharkStage session…
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !routeAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-heading">
        <div className="rounded-3xl border border-primary/10 bg-white/90 px-6 py-4 shadow">
          Redirecting to the appropriate dashboard…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-heading">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-background/70">
        <Header />
        <main className="flex-1 overflow-auto bg-white/60 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
