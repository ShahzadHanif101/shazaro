import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-white"
            >
              SHAZARO
            </Link>

            <p className="mt-1 text-xs text-slate-500">
              Personal streaming management platform.
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs text-slate-500 transition-colors hover:text-white"
            >
              Home
            </Link>

            <a
              href="#features"
              className="text-xs text-slate-500 transition-colors hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-xs text-slate-500 transition-colors hover:text-white"
            >
              About
            </a>

            <Link
              href="/login"
              className="text-xs text-slate-500 transition-colors hover:text-white"
            >
              Admin
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-slate-800 pt-6 text-center sm:text-left">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SHAZARO. Built independently.
          </p>
        </div>
      </div>
    </footer>
  );
}
