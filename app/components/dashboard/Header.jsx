"use client";
import { useEffect, useState } from "react";
import {
  Ban,
  Bell,
  CheckCircle,
  ChevronDown,
  Inbox,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import Link from "next/link";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
        <div className="relative">
          <button
            className="relative p-2 rounded hover:bg-gray-100"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {userNotifications.filter((ele) => ele.isRead == false).length >
              0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                {userNotifications.filter((ele) => ele.isRead == false).length}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg w-64 z-50">
              <p className="font-semibold p-3 ps-5">Notifications</p>
              <ul className="space-y-2 text-sm">
                {userNotifications.map((n, i) => (
                  <Link
                    href={n.link}
                    key={i}
                    onClick={() => {
                      markAsRead(n._id);
                    }}
                    className={`${
                      !n.isRead ? "bg-blue-300/50 hover:bg-blue-300/60" : null
                    } p-2 hover:bg-gray-100 rounded cursor-pointer flex gap-2`}
                  >
                    {n.type == "offer_sent" ? (
                      <Inbox color="grey" />
                    ) : n.type == "offer_cancelled" ? (
                      <XCircle color="red" />
                    ) : n.type == "offer_accepted" ? (
                      <CheckCircle color="green" />
                    ) : n.type == "offer_rejected" ? (
                      <Ban color="red" />
                    ) : null}
                    <span>{n.message}</span>
                  </Link>
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
