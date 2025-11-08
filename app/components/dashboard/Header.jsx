"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import Notifications from "./Notifications";
import { clearUser } from "@/lib/features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);

  const displayName = currentUser
    ? `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim() ||
      currentUser.email
    : "Account";
  const roleLabel = currentUser?.accountType
    ? currentUser.accountType.charAt(0).toUpperCase() +
      currentUser.accountType.slice(1)
    : "Investor";

  const initials = currentUser
    ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.toUpperCase() ||
      "SS"
    : "SS";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      dispatch(clearUser());
      setUserMenuOpen(false);
    }
  };

  return (
    <header className="bg-slate-200 shadow-md p-2 sm:p-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-lg sm:text-xl font-semibold text-slate-800">
        Dashboard
      </h1>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <Notifications />

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-2 py-1 shadow-sm hover:border-slate-400 transition"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-primary/80 text-sm font-semibold text-white">
              {currentUser?.profilePicUrl ? (
                <Image
                  src={currentUser.profilePicUrl}
                  alt={displayName}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <span className="hidden text-left sm:flex sm:flex-col">
              <span className="text-sm font-semibold text-slate-800">
                {displayName}
              </span>
              <span className="text-xs text-slate-500 capitalize">
                {roleLabel}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-11 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
              <Link
                href="/account/profile"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setUserMenuOpen(false)}
              >
                View profile
              </Link>
              <Link
                href="/account/settings"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setUserMenuOpen(false)}
              >
                Account settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
