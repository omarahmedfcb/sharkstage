"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { LayoutGrid, FolderKanban, UserCog } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  // Auto-close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Tailwind md breakpoint
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLinkClass = (isActive) => {
    const base = `flex items-center gap-3 rounded-lg transition-all duration-200 ${
      open ? "px-4 py-2 justify-start" : "px-0 py-3 justify-center"
    }`;
    const color = isActive
      ? "bg-slate-300 text-slate-900 font-semibold"
      : "text-slate-700 hover:bg-slate-400 hover:text-slate-900";
    return `${base} ${color}`;
  };

  return (
    <aside
      className={`bg-slate-200 text-gray-700 border-r border-gray-300 h-screen flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-20"
      }`}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div
        className={`flex items-center p-4 border-b border-gray-300 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        <span
          className={`font-bold text-sm transition-all duration-400 overflow-hidden ${
            open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 w-0"
          }`}
        >
          Freelance Dashboard
        </span>

        {/* Toggle button */}
        <button
          onClick={() => setOpen((s) => !s)}
          className="p-1 rounded hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 transition"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="p-3 flex-1 flex flex-col gap-2 text-slate-700">
        <Link 
          href="/account" 
          className={getLinkClass(pathname === "/account")}
        >
          <LayoutGrid className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`} />
          {open && <span className="text-sm">Overview</span>}
        </Link>

        <Link 
          href="/account/projects" 
          className={getLinkClass(pathname === "/account/projects")}
        >
          <FolderKanban className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`} />
          {open && <span className="text-sm">Projects</span>}
        </Link>

        <Link 
          href="/account/profile" 
          className={getLinkClass(pathname === "/account/profile")}
        >
          <UserCog className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`} />
          {open && <span className="text-sm">Profile</span>}
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-300">
        {open ? (
          <div className="text-xs text-slate-700">v1.0 • Rowida</div>
        ) : (
          <div className="text-center text-slate-700 text-xs">v1.0</div>
        )}
      </div>
    </aside>
  );
}
