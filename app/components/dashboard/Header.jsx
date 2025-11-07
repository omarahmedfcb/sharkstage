"use client";
import { useEffect, useState } from "react";
import {
  Ban,
  Bell,
  CheckCircle,
  ChevronDown,
  Inbox,
  MessageCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import Link from "next/link";
import Notifications from "./Notifications";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);

  const [userNotifications, setUserNotifications] = useState([]);
  const fetchUserNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await api.get(`/notifications/user`);
      setUserNotifications(res.data.userNotifications);
    } catch (err) {
      console.error(err);
    }
  };
  const markAsRead = async (notId) => {
    try {
      await api.patch(`/notifications/read/${notId}`);
      fetchUserNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, [currentUser]);

  return (
    <header className="bg-slate-200 shadow-md p-2 sm:p-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-lg sm:text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center space-x-2 sm:space-x-4 relative">
        {/* Notifications */}
        <Notifications />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100"
          >
            <Image
              src="/avatar-placeholder.jpg"
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
