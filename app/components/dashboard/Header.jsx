"use client";
import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  User,
  LogOut,
  LayoutGrid,
  Settings,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logoutUser } from "@/lib/features/auth/auththunks";
import Notifications from "./Notifications";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Notifications */}
        <Notifications />

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm relative">
              {currentUser?.profilePicUrl ? (
                <img
                  src={currentUser.profilePicUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {currentUser?.firstName?.charAt(0) || "U"}
                  {currentUser?.lastName?.charAt(0) || ""}
                </div>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-700">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser?.accountType}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 top-12 mt-2 bg-white shadow-xl rounded-lg w-56 py-2 z-50 border border-gray-200">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href="/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/account/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/account/projects"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>
                    {currentUser?.accountType === "investor"
                      ? "My Investments"
                      : "My Projects"}
                  </span>
                </Link>

                <Link
                  href="/account/offers"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Offers</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-200 pt-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
