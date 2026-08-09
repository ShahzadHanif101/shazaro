"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tv,
  FolderKanban,
  Users,
  Utensils,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    iconColor: "text-cyan-400",
    exact: true,
  },
  {
    href: "/admin/channels",
    label: "Channels",
    icon: Tv,
    iconColor: "text-sky-400",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderKanban,
    iconColor: "text-green-400",
  },
  {
    href: "/admin/iptv-users",
    label: "Users",
    icon: Users,
    iconColor: "text-pink-400",
  },
  {
    href: "/admin/banquet",
    label: "Banquet",
    icon: Utensils,
    iconColor: "text-yellow-400",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    iconColor: "text-orange-400",
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {open && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-200 ease-out md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ===================================================
            SIDEBAR HEADER
        =================================================== */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <span className="font-semibold tracking-tight text-white">
            SHAZARO
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Close menu"
            title="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon, iconColor, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} className={active ? "text-white" : iconColor} />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ===================================================
            SIDEBAR FOOTER
        =================================================== */}
        <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
          SHAZARO v1.0
        </div>
      </aside>
    </>
  );
}
