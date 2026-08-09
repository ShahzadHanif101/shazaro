import Link from "next/link";
import { Tv, Settings, Boxes } from "lucide-react";

import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";

const features = [
  {
    icon: Tv,
    title: "Channel Management",
    description:
      "Manage channels, logos, categories and streaming information from one clean interface.",
  },
  {
    icon: Settings,
    title: "Simple Management",
    description:
      "Keep your configuration organized with a straightforward administration experience.",
  },
  {
    icon: Boxes,
    title: "Flexible Architecture",
    description:
      "Built with independent frontend components and portable data so the project can move with you.",
  },
];

const frontendItems = ["Own components", "Own layout", "Own UI"];

const dataItems = ["Own files", "Simple format", "No external database"];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar />

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
              <span className="mr-2 h-2 w-2 rounded-full bg-cyan-400" />

              <span className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                Personal Streaming Platform
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Your streams.
              <br />
              <span className="text-cyan-400">Your control.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              SHAZARO is a simple and flexible platform for managing your
              channels, categories and streaming resources from one place.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="w-full rounded-lg bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 sm:w-auto"
              >
                Open Admin Panel
              </Link>

              <a
                href="#features"
                className="w-full rounded-lg border border-slate-700 px-7 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white sm:w-auto"
              >
                Explore SHAZARO
              </a>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-1 border-y border-slate-800/80 sm:grid-cols-3">
            <div className="px-6 py-6 text-center sm:border-r sm:border-slate-800/80">
              <p className="text-2xl font-bold text-white">Simple</p>

              <p className="mt-1 text-xs text-slate-500">Easy management</p>
            </div>

            <div className="border-t border-slate-800/80 px-6 py-6 text-center sm:border-t-0 sm:border-r">
              <p className="text-2xl font-bold text-white">Flexible</p>

              <p className="mt-1 text-xs text-slate-500">Built your way</p>
            </div>

            <div className="border-t border-slate-800/80 px-6 py-6 text-center sm:border-t-0">
              <p className="text-2xl font-bold text-white">Portable</p>

              <p className="mt-1 text-xs text-slate-500">
                Platform independent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section id="features" className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              Features
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything in one place.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              A clean foundation for managing your personal streaming platform.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition-all hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          BUILT FOR FREEDOM / ARCHITECTURE
      ===================================================== */}
      <section id="about" className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              Built for freedom
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Your project. Your architecture.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400">
              SHAZARO is designed to keep the frontend independent and the data
              portable, so the project is not tied to a particular platform or
              service.
            </p>
          </div>

          {/* Architecture */}
          <div className="mx-auto mt-16 max-w-4xl">
            {/* SHAZARO */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-sm font-bold text-cyan-400 shadow-lg shadow-cyan-500/5">
              SHAZARO
            </div>

            <div className="mx-auto h-10 w-px bg-slate-700" />

            {/* Frontend + Data */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Frontend */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <span className="text-lg">⚛</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Frontend</h3>

                    <p className="text-xs text-slate-500">React + TypeScript</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {frontendItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Data */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                    <span className="text-lg">▣</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Data</h3>

                    <p className="text-xs text-slate-500">JSON files</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {dataItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-400"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto h-10 w-px bg-slate-700" />

            {/* Application */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Application
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                Platform ready
              </p>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                The application sits between the interface and the data, keeping
                the project flexible and portable.
              </p>
            </div>

            <div className="mx-auto h-10 w-px bg-slate-700" />

            {/* Platforms */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center transition-colors hover:border-slate-700">
                <p className="text-sm font-semibold text-white">Vercel</p>

                <p className="mt-1 text-xs text-slate-500">One possible home</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center transition-colors hover:border-slate-700">
                <p className="text-sm font-semibold text-white">Cloudflare</p>

                <p className="mt-1 text-xs text-slate-500">
                  Another possible home
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
    FINAL CTA
===================================================== */}
      <section className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
            Ready to get started?
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your streams. Your control.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Manage your streaming platform from one simple, flexible and
            independent interface.
          </p>

          <div className="mt-9">
            <Link
              href="/login"
              className="inline-flex rounded-lg bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              Open Admin Panel
            </Link>
          </div>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
