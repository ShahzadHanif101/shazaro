"use client";

import { useEffect, useState } from "react";
import type { Banquet, IptvUser } from "@/lib/types";

export default function IptvUsersPage() {
  const [users, setUsers] = useState<IptvUser[]>([]);
  const [banquets, setBanquets] = useState<Banquet[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IptvUser | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [banquetId, setBanquetId] = useState<number | "">("");
  const [enabled, setEnabled] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [maxConnections, setMaxConnections] = useState(1);

  async function loadData() {
    try {
      const [usersResponse, banquetResponse] = await Promise.all([
        fetch("/api/iptv-users"),
        fetch("/api/banquet"),
      ]);

      if (!usersResponse.ok || !banquetResponse.ok) {
        throw new Error("Failed to load IPTV users");
      }

      const usersData = await usersResponse.json();
      const banquetData = await banquetResponse.json();

      setUsers(usersData);
      setBanquets(banquetData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddModal() {
    setEditingUser(null);

    setUsername("");
    setPassword("");
    setBanquetId("");
    setEnabled(true);
    setExpiresAt("");
    setMaxConnections(1);

    setShowModal(true);
  }

  function openEditModal(user: IptvUser) {
    setEditingUser(user);

    setUsername(user.username);
    setPassword(user.password);
    setBanquetId(user.banquetId);
    setEnabled(user.enabled);
    setExpiresAt(user.expiresAt ? user.expiresAt.slice(0, 16) : "");
    setMaxConnections(user.maxConnections);

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingUser(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (banquetId === "") {
      alert("Please select a banquet.");
      return;
    }

    if (maxConnections < 1) {
      alert("Max connections must be at least 1.");
      return;
    }

    try {
      const url = editingUser
        ? `/api/iptv-users/${editingUser.id}`
        : "/api/iptv-users";

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          banquetId: Number(banquetId),
          enabled,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          maxConnections: Number(maxConnections),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save IPTV user");
      }

      closeModal();
      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "Failed to save IPTV user.",
      );
    }
  }

  async function toggleUser(user: IptvUser) {
    try {
      const response = await fetch(`/api/iptv-users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !user.enabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to update user.");
    }
  }

  async function deleteUser(user: IptvUser) {
    const confirmed = window.confirm(`Delete "${user.username}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/iptv-users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete user.");
    }
  }

  function getBanquetName(id: number) {
    return (
      banquets.find((banquet) => banquet.id === id)?.name || `Banquet #${id}`
    );
  }

  function getExpiryStatus(user: IptvUser) {
    if (!user.expiresAt) {
      return {
        label: "Never",
        className: "bg-slate-500/10 text-slate-400",
      };
    }

    const expiry = new Date(user.expiresAt);

    if (expiry.getTime() < Date.now()) {
      return {
        label: "Expired",
        className: "bg-red-500/10 text-red-400",
      };
    }

    return {
      label: expiry.toLocaleDateString(),
      className: "bg-emerald-500/10 text-emerald-400",
    };
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white">IPTV Users</h1>

              <p className="mt-1 text-sm text-slate-400">
                Manage IPTV accounts and their banquet access.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="w-full shrink-0 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
            >
              + Add IPTV User
            </button>
          </div>
        </div>

        {/* =====================================================
            USERS TABLE
        ===================================================== */}
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Loading IPTV users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No IPTV users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950/60">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      ID
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Username
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Banquet
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Expiry
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Connections
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => {
                    const expiry = getExpiryStatus(user);

                    return (
                      <tr
                        key={user.id}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {user.id}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-white">
                            {user.username}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">
                            {getBanquetName(user.banquetId)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${expiry.className}`}
                          >
                            {expiry.label}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {user.maxConnections}
                        </td>

                        <td className="px-5 py-4">
                          {user.enabled ? (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                              Enabled
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                              Disabled
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-4">
                            <button
                              type="button"
                              onClick={() => toggleUser(user)}
                              className="rounded-lg border border-slate-500/30 px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
                            >
                              {user.enabled ? "Disable" : "Enable"}
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteUser(user)}
                              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 px-5 py-5 sm:px-6">
                <div className="min-w-0 pr-4">
                  <h2 className="text-lg font-semibold text-white">
                    {editingUser ? "Edit IPTV User" : "Add IPTV User"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Create an IPTV account and assign its banquet.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="shrink-0 text-2xl leading-none text-slate-500 transition hover:text-white"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit}>
                <div className="max-h-[calc(100vh-180px)] overflow-y-auto px-5 py-5 sm:px-6">
                  {/* Username */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Username
                    </label>

                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="username"
                      autoComplete="off"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Password
                    </label>

                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Password"
                      autoComplete="off"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    />
                  </div>

                  {/* Banquet */}
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Banquet
                    </label>

                    <select
                      required
                      value={banquetId}
                      onChange={(event) =>
                        setBanquetId(
                          event.target.value ? Number(event.target.value) : "",
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                    >
                      <option value="">Select banquet</option>

                      {banquets
                        .filter((banquet) => banquet.enabled)
                        .map((banquet) => (
                          <option key={banquet.id} value={banquet.id}>
                            {banquet.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Expiry + Connections */}
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Expiry
                      </label>

                      <input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(event) => setExpiresAt(event.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Max Connections
                      </label>

                      <input
                        type="number"
                        min="1"
                        required
                        value={maxConnections}
                        onChange={(event) =>
                          setMaxConnections(Number(event.target.value))
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Enabled */}
                  <label className="mt-5 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(event) => setEnabled(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                    />

                    <span className="text-sm text-slate-300">User enabled</span>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    {editingUser ? "Save Changes" : "Add IPTV User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
