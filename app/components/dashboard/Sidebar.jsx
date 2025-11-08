"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import {
  LayoutGrid,
  FolderKanban,
  UserCog,
  House,
  PanelTop,
  Handshake,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

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

  const getLinkClass = (isActive) => {
    const base = `flex items-center gap-3 rounded-2xl transition all duration-200 ${
      open ? "px-4 py-2.5 justify-start" : "px-0 py-3 justify-center"
    }`;
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
            <p className="text-xs text-primary/70 capitalize">account space</p>
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

      {/* Nav */}
      <nav className="p-3 flex-1 flex flex-col gap-2 text-slate-700">
        <Link href="/account" className={getLinkClass(pathname === "/account")}>
          <LayoutGrid
            className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
          />
          {open && <span className="text-sm">Overview</span>}
        </Link>

        <Link
          href="/account/projects"
          className={getLinkClass(pathname === "/account/projects")}
        >
          <FolderKanban
            className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
          />
          {open && <span className="text-sm">Projects</span>}
        </Link>

        <Link
          href="/account/profile"
          className={getLinkClass(pathname === "/account/profile")}
        >
          <UserCog
            className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
          />
          {open && <span className="text-sm">Profile</span>}
        </Link>
        <Link
          href="/account/offers"
          className={getLinkClass(pathname === "/account/offers")}
        >
          <Handshake
            className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
          />
          {open && <span className="text-sm">Offers</span>}
        </Link>
        <Link href="/" className={getLinkClass(pathname === "/")}>
          <House className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`} />
          {open && <span className="text-sm">Home</span>}
        </Link>
        <Link
          href="/projects"
          className={getLinkClass(pathname === "/projects")}
        >
          <PanelTop
            className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
          />
          {open && <span className="text-sm">Browse projects</span>}
        </Link>
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
