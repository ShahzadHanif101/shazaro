"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMenuOpen(true)} />

        <main className="flex-1 p-4 md:p-8">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
