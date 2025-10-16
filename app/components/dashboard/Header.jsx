"use client";
import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifications = ["📌 New project assigned", "💰 Payment received", "✅ Task completed"];

  return (
    <header className="bg-slate-200 shadow-md p-2 sm:p-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-lg sm:text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center space-x-2 sm:space-x-4 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded hover:bg-gray-100"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
              {notifications.length}
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg w-64 p-3 z-50">
              <p className="font-semibold mb-2">Notifications</p>
              <ul className="space-y-2 text-sm">
                {notifications.map((n, i) => (
                  <li key={i} className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100"
          >
            <Image 
              src="/dashboard/proflie.jfif" 
              alt="profile" 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-full" 
            />
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg w-40 py-2 z-50">
              <button className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
                Profile
              </button>
              <button className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
                Settings
              </button>
              <button className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-red-50">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
