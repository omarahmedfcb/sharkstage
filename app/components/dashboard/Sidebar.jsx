"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import {
  LayoutGrid,
  FolderKanban,
  UserCog,
  House,
  PanelTop,
  MessageSquare,
  Briefcase,
  Handshake,
} from "lucide-react";

const baseNavItems = [
  {
    label: "Overview",
    href: "/account",
    icon: LayoutGrid,
    roles: ["investor", "owner", "admin"],
  },
  {
    label: "My Projects",
    href: "/account/projects",
    icon: FolderKanban,
    roles: ["owner"],
  },
  {
    label: "Opportunities",
    href: "/projects",
    icon: Briefcase,
    roles: ["investor", "admin"],
  },
  {
    label: "Messages",
    href: "/account/messages",
    icon: MessageSquare,
    roles: ["investor", "owner", "admin"],
  },
  {
    label: "Offers",
    href: "/account/offers",
    icon: Handshake,
    roles: ["investor", "owner", "admin"],
  },
  {
    label: "Profile",
    href: "/account/profile",
    icon: UserCog,
    roles: ["investor", "owner", "admin"],
  },
  {
    label: "Admin Command Center",
    href: "/account/admin",
    icon: PanelTop,
    roles: ["admin"],
  },
  {
    label: "Back to site",
    href: "/",
    icon: House,
    roles: ["investor", "owner", "admin"],
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { currentUser } = useSelector((state) => state.auth);

  const accountType = currentUser?.accountType ?? "investor";

  const navItems = useMemo(() => {
    return baseNavItems.filter((item) => item.roles.includes(accountType));
  }, [accountType]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLinkClass = (isActive, disabled) => {
    const base = `flex items-center gap-3 rounded-2xl transition all duration-200 ${
      open ? "px-4 py-2.5 justify-start" : "px-0 py-3 justify-center"
    }`;
    if (disabled) {
      return `${base} text-paragraph/60 cursor-not-allowed`;
    }
    const color = isActive
      ? "bg-primary/15 text-primary font-semibold shadow-sm"
      : "text-heading/70 hover:bg-primary/10 hover:text-primary";
    return `${base} ${color}`;
  };

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-primary/10 bg-gradient-to-b from-white to-soft/60 text-heading shadow-sm transition-all duration-300 ${
        open ? "w-72" : "w-24"
      }`}
      aria-label="Sidebar"
    >
      <div
        className={`flex items-center border-b border-primary/10 px-4 py-5 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="h-9 w-9 rounded-xl bg-primary text-white grid place-items-center font-bold">
            SS
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">SharkStage</p>
            <p className="text-xs text-primary/70 capitalize">{accountType} space</p>
          </div>
        </div>
        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-xl border border-primary/20 p-2 text-primary transition hover:border-primary/40"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={18} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);
          const disabled = item.comingSoon;
          return (
            <Link
              key={item.href}
              href={disabled ? "#" : item.href}
              className={getLinkClass(isActive, disabled)}
              aria-disabled={disabled}
              onClick={(event) => {
                if (disabled) {
                  event.preventDefault();
                }
              }}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`} />
              {open && (
                <span className="text-sm">
                  {item.label}
                  {item.comingSoon && <sup className="ml-1 text-[10px] text-primary/70">soon</sup>}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-primary/10">
        {open ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-heading">
            <p className="font-semibold text-sm">Need assistance?</p>
            <p className="mt-1 text-paragraph">
              Our team is here to help you onboard new investors and projects.
            </p>
            <button className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">
              Contact support
            </button>
          </div>
        ) : (
          <div className="text-center text-[10px] text-paragraph/80">v1.0</div>
        )}
      </div>
    </aside>
  );
}
