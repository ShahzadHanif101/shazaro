"use client";

import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 md:px-6">
      {/* =====================================================
          LEFT SIDE
      ===================================================== */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Open menu"
          title="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Brand */}
        <div className="text-lg font-semibold tracking-tight text-white">
          SHAZARO
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-slate-400 sm:inline">Admin</span>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <LogOut size={16} />

          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
