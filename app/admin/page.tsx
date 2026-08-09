import Link from "next/link";
import { readData } from "@/lib/data";
import { Tv, Folder, Users, Building2 } from "lucide-react";
import type { Channel, Category, IptvUser, Banquet } from "@/lib/types";

export default async function AdminDashboard() {
  const channels = await readData<Channel[]>("channels.json");
  const categories = await readData<Category[]>("categories.json");
  const users = await readData<IptvUser[]>("iptv-users.json");
  const banquet = await readData<Banquet[]>("banquet.json");
  return (
    <div className="space-y-8">
      {/* =====================================================
          DASHBOARD HEADER / WELCOME
      ===================================================== */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-cyan-400">
              SHAZARO ADMIN
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Welcome back 👋
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-200">
              Manage your channels, categories, users, and platform settings
              from one place.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Platform
            </p>

            <p className="mt-1 text-sm font-medium text-slate-300">
              SHAZARO v1.0
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Channels */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-cyan-400">Channels</p>

            <Tv className="h-10 w-10 text-cyan-400" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-white">
            {channels.length}
          </p>

          <p className="mt-2 text-s text-slate-300">Total channels</p>
        </div>

        {/* Categories */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-green-400">Categories</p>

            <Folder className="h-10 w-10 text-green-400" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-white">
            {categories.length}
          </p>

          <p className="mt-2 text-s text-slate-300">Total categories</p>
        </div>

        {/* Users */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-pink-400">Users</p>

            <Users className="h-10 w-10 text-pink-400" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-white">
            {users.length}
          </p>

          <p className="mt-2 text-s text-slate-300">Total users</p>
        </div>

        {/* Banquet */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-yellow-400">Banquet</p>

            <Building2 className="h-10 w-10 text-yellow-400" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-white">
            {banquet.length}
          </p>

          <p className="mt-2 text-s text-slate-300">Total banquet items</p>
        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly access the most common admin tasks.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Add Channel */}
          <Link
            href="/admin/channels"
            className="group rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5 transition-colors hover:border-cyan-500/40 hover:bg-slate-800"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              +
            </div>

            <h3 className="font-medium text-white">Add Channel</h3>

            <p className="mt-1 text-sm text-sky-300">
              Create and manage channels.
            </p>
          </Link>

          {/* Add Category */}
          <Link
            href="/admin/categories"
            className="group rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5 transition-colors hover:border-green-500/40 hover:bg-slate-800"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
              +
            </div>

            <h3 className="font-medium text-white">Add Category</h3>

            <p className="mt-1 text-sm text-sky-300">Organize your channels.</p>
          </Link>

          {/* Add User */}
          <Link
            href="/admin/iptv-users"
            className="group rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5 transition-colors hover:border-pink-500/40 hover:bg-slate-800"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
              +
            </div>

            <h3 className="font-medium text-white">Add User</h3>

            <p className="mt-1 text-sm text-sky-300">
              Create and manage users.
            </p>
          </Link>

          {/* Banquet */}
          <Link
            href="/admin/banquet"
            className="group rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5 transition-colors hover:border-yellow-500/40 hover:bg-slate-800"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
              +
            </div>

            <h3 className="font-medium text-white">Banquet</h3>

            <p className="mt-1 text-sm text-sky-300">Manage banquet items.</p>
          </Link>
        </div>
      </section>

      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">System Status</h2>

          <p className="mt-1 text-sm text-slate-500">
            Current SHAZARO platform status.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="grid grid-cols-1 divide-y divide-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {/* Application */}
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-white">Application</p>

                <p className="mt-1 text-xs text-slate-500">
                  SHAZARO application
                </p>
              </div>

              <span className="flex items-center gap-2 text-sm font-medium text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Operational
              </span>
            </div>

            {/* Authentication */}
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-white">Authentication</p>

                <p className="mt-1 text-xs text-slate-500">
                  Login and session system
                </p>
              </div>

              <span className="flex items-center gap-2 text-sm font-medium text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Active
              </span>
            </div>

            {/* Data Storage */}
            <div className="flex items-center justify-between border-t border-slate-800 p-5 sm:border-t-0">
              <div>
                <p className="text-sm font-medium text-white">Data Storage</p>

                <p className="mt-1 text-xs text-slate-500">
                  Local project data
                </p>
              </div>

              <span className="text-sm font-medium text-cyan-400">JSON</span>
            </div>

            {/* Environment */}
            <div className="flex items-center justify-between border-t border-slate-800 p-5 sm:border-t-0">
              <div>
                <p className="text-sm font-medium text-white">Environment</p>

                <p className="mt-1 text-xs text-slate-500">Current runtime</p>
              </div>

              <span className="text-sm font-medium text-yellow-400">
                Development
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DASHBOARD PLACEHOLDER
      ===================================================== */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-center text-cyan-400">
          Designed By Shahzad Hanif
        </p>
      </section>
    </div>
  );
}
