import Link from "next/link";

export default function LandingNavbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          SHAZARO
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            Home
          </Link>

          <a
            href="#features"
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            About
          </a>
        </nav>

        {/* Login */}
        <Link
          href="/login"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
        >
          Admin Login
        </Link>
      </div>
    </header>
  );
}
