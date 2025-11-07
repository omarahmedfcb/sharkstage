"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@/lib/api/notifications";

const FALLBACK_NOTIFICATIONS = [
  {
    _id: "fallback-1",
    title: "New project match",
    body: "AI Diagnostics Platform matches your investment preferences.",
    createdAt: new Date().toISOString(),
    status: "unread",
  },
  {
    _id: "fallback-2",
    title: "Offer accepted",
    body: "Vertical Farming Expansion accepted your offer.",
    createdAt: new Date().toISOString(),
    status: "unread",
  },
  {
    _id: "fallback-3",
    title: "Message received",
    body: "Ahmed Khalil replied to your conversation.",
    createdAt: new Date().toISOString(),
    status: "read",
  },
];

export function useNotifications({ eager = true } = {}) {
  const { currentUser } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState(FALLBACK_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!eager || !currentUser?._id) return undefined;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNotifications();
        if (cancelled) return;
        if (data.length) {
          setNotifications(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Unable to load notifications");
          setNotifications(FALLBACK_NOTIFICATIONS);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [currentUser?._id, eager]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: "read" }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead: handleMarkAsRead,
  };
}

