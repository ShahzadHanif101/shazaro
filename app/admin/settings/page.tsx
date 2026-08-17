"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage SHAZARO system settings and data.
        </p>
      </div>

      <div className="space-y-6">
        {/* =====================================================
            FIND & REPLACE
        ===================================================== */}
        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">Find & Replace</h2>

            <p className="mt-1 text-sm text-slate-400">
              Find and replace values in SHAZARO JSON data.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-white">
                  JSON Data Find & Replace
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Preview and safely replace values in selected JSON fields.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/settings/data/find-replace")}
                className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                Open Find & Replace
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            DATA MANAGEMENT
        ===================================================== */}
        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              Data Management
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Manage SHAZARO JSON data stored in Vercel Blob.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {/* Channels */}
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-white">channels.json</h3>

                <p className="mt-1 text-sm text-slate-500">
                  IPTV channel database
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/settings/data/channels")}
                className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                View JSON
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-white">categories.json</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Channel categories and groups
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/settings/data/categories")}
                className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                View JSON
              </button>
            </div>

            {/* Banquet */}
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-white">banquet.json</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Access rules and restrictions
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/settings/data/banquet")}
                className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                View JSON
              </button>
            </div>

            {/* IPTV Users */}
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-white">iptv-users.json</h3>

                <p className="mt-1 text-sm text-slate-500">
                  IPTV user accounts and access settings
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/settings/data/iptv-users")}
                className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                View JSON
              </button>
            </div>
          </div>

          {/* Backup */}
          <div className="border-t border-slate-800 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-white">Backup All Data</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Download a backup of all SHAZARO JSON data.
                </p>
              </div>

              <button
                type="button"
                disabled
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-500"
              >
                Backup All Data
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            SYSTEM
        ===================================================== */}
        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">System</h2>

            <p className="mt-1 text-sm text-slate-400">
              SHAZARO storage and environment information.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Storage Provider
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  SHAZARO JSON data storage
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Vercel Blob
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
