"use client";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useNotifications } from "@/lib/hooks/useNotifications";

function formatDistanceFromNow(input) {
  if (!input) return "just now";
  const date = new Date(input);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d ago`;
  const diffWeeks = Math.round(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} wk ago`;
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} mo ago`;
  const diffYears = Math.round(diffDays / 365);
  return `${diffYears} yr ago`;
}

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const {
    notifications,
    loading: notificationsLoading,
    error: notificationsError,
    markAsRead,
  } = useNotifications({ eager: true });

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.status !== "read").length,
    [notifications]
  );

  const initials = currentUser
    ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.toUpperCase()
    : "SS";

  const fullName = currentUser
    ? `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim()
    : "SharkStage Member";

  const roleLabel = currentUser?.accountType
    ? currentUser.accountType.charAt(0).toUpperCase() + currentUser.accountType.slice(1)
    : "Investor";

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-white/90 backdrop-blur px-4 py-3 md:px-8 md:py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-heading md:text-2xl">
            Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-sm text-paragraph">
            Manage your SharkStage portfolio and stay in sync across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="relative">
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary transition hover:bg-primary/20"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="Toggle notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 rounded-full bg-buttons px-1.5 text-[10px] font-semibold text-heading shadow">
              {unreadCount}
            </span>
          </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-primary/10 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-heading">Latest updates</p>
                  {notificationsError && (
                    <p className="text-xs text-red-500">{notificationsError}</p>
                  )}
                </div>
                <button
                  className="text-xs text-primary hover:underline disabled:text-primary/40"
                  onClick={() =>
                    notifications
                      .filter((notification) => notification.status !== "read")
                      .forEach((notification) => markAsRead(notification._id))
                  }
                  disabled={unreadCount === 0 || notificationsLoading}
                >
                  Mark all read
                </button>
                </div>
              <div className="mt-3 space-y-2 text-sm text-paragraph">
                {notificationsLoading ? (
                  <div className="space-y-2">
                    <div className="h-10 rounded-xl bg-primary/5 animate-pulse" />
                    <div className="h-10 rounded-xl bg-primary/5 animate-pulse" />
                  </div>
                ) : notifications.length ? (
                  notifications.slice(0, 6).map((notification) => (
                    <button
                      key={notification._id}
                      className={`w-full rounded-xl border border-transparent px-3 py-2 text-left transition ${
                        notification.status !== "read"
                          ? "border-primary/20 bg-primary/5"
                          : "hover:border-primary/20 hover:bg-primary/5"
                      }`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {notification.title ?? "Notification"}
                      </p>
                      <p className="mt-1 text-sm text-paragraph">{notification.body}</p>
                      <p className="mt-1 text-[10px] uppercase text-paragraph/60">
                        {formatDistanceFromNow(notification.createdAt)}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="rounded-xl border border-primary/10 bg-primary/5 px-3 py-4 text-xs text-paragraph">
                    You're all caught up. We'll notify you when something needs your attention.
                  </p>
                )}
              </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-full border border-primary/20 bg-white px-2 py-1.5 text-left shadow-sm transition hover:border-primary/40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                {currentUser?.profilePicUrl ? (
                  <Image
                    src={currentUser.profilePicUrl}
                    alt={fullName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </span>
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-heading">{fullName}</p>
                <p className="text-xs capitalize text-primary">{roleLabel}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-primary" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-primary/10 bg-white py-2 shadow-xl">
                <button className="block w-full px-4 py-2 text-left text-sm text-heading hover:bg-primary/5">
                  View profile
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-heading hover:bg-primary/5">
                  Account settings
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
