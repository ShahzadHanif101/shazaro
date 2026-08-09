"use client";

import { useEffect, useState } from "react";
import type { Banquet, Category } from "@/lib/types";

export default function BanquetPage() {
  const [banquets, setBanquets] = useState<Banquet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingBanquet, setEditingBanquet] = useState<Banquet | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState<"all" | "selected">("all");
  const [allowedCategories, setAllowedCategories] = useState<number[]>([]);
  const [enabled, setEnabled] = useState(true);

  async function loadData() {
    try {
      const [banquetResponse, categoryResponse] = await Promise.all([
        fetch("/api/banquet"),
        fetch("/api/categories"),
      ]);

      if (!banquetResponse.ok || !categoryResponse.ok) {
        throw new Error("Failed to load banquet data");
      }

      const banquetData = await banquetResponse.json();
      const categoryData = await categoryResponse.json();

      setBanquets(banquetData);
      setCategories(categoryData);
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
    setEditingBanquet(null);
    setName("");
    setDescription("");
    setAccess("all");
    setAllowedCategories([]);
    setEnabled(true);
    setShowModal(true);
  }

  function openEditModal(banquet: Banquet) {
    setEditingBanquet(banquet);
    setName(banquet.name);
    setDescription(banquet.description ?? "");
    setAccess(banquet.access);
    setAllowedCategories(banquet.allowedCategories ?? []);
    setEnabled(banquet.enabled);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingBanquet(null);
  }

  function toggleCategory(categoryId: number) {
    setAllowedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (access === "selected" && allowedCategories.length === 0) {
      alert("Select at least one category.");
      return;
    }

    try {
      const url = editingBanquet
        ? `/api/banquet/${editingBanquet.id}`
        : "/api/banquet";

      const method = editingBanquet ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          access,
          allowedCategories: access === "selected" ? allowedCategories : [],
          enabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save banquet");
      }

      closeModal();
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to save banquet.");
    }
  }

  async function toggleBanquet(banquet: Banquet) {
    try {
      const response = await fetch(`/api/banquet/${banquet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !banquet.enabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update banquet");
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to update banquet.");
    }
  }

  async function deleteBanquet(banquet: Banquet) {
    const confirmed = window.confirm(`Delete "${banquet.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/banquet/${banquet.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete banquet");
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete banquet.");
    }
  }

  function getCategoryNames(banquet: Banquet) {
    if (banquet.access === "all") {
      return "All categories";
    }

    const names = (banquet.allowedCategories ?? [])
      .map(
        (categoryId) =>
          categories.find((category) => category.id === categoryId)?.name,
      )
      .filter(Boolean);

    return names.length > 0 ? names.join(", ") : "No categories";
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
              <h1 className="text-2xl font-bold text-white">Banquet</h1>

              <p className="mt-1 text-sm text-slate-400">
                Manage access groups and category permissions.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="w-full shrink-0 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
            >
              + Add Banquet
            </button>
          </div>
        </div>

        {/* =====================================================
            BANQUET LIST
        ===================================================== */}
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Loading banquets...
            </div>
          ) : banquets.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No banquets found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950/60">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      ID
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Banquet
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Access
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Categories
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
                  {banquets.map((banquet) => (
                    <tr
                      key={banquet.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {banquet.id}
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {banquet.name}
                          </p>

                          {banquet.description && (
                            <p className="mt-1 text-xs text-slate-500">
                              {banquet.description}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {banquet.access === "all" ? (
                          <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400">
                            All
                          </span>
                        ) : (
                          <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">
                            Selected
                          </span>
                        )}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-sm text-slate-400">
                        {getCategoryNames(banquet)}
                      </td>

                      <td className="px-5 py-4">
                        {banquet.enabled ? (
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
                            onClick={() => toggleBanquet(banquet)}
                            className="rounded-lg border border-slate-500/30 px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
                          >
                            {banquet.enabled ? "Disable" : "Enable"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(banquet)}
                            className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteBanquet(banquet)}
                            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                    {editingBanquet ? "Edit Banquet" : "Add Banquet"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Define category access for this group.
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
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Banquet Name
                    </label>

                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Kids"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Optional description"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                    />
                  </div>

                  {/* Access */}
                  <div className="mt-5">
                    <label className="mb-3 block text-sm font-medium text-slate-300">
                      Category Access
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-700 bg-slate-950 p-4 transition hover:border-slate-600">
                        <input
                          type="radio"
                          name="access"
                          value="all"
                          checked={access === "all"}
                          onChange={() => setAccess("all")}
                          className="mt-0.5"
                        />

                        <div>
                          <p className="text-sm font-medium text-white">
                            All Categories
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Includes categories added later.
                          </p>
                        </div>
                      </label>

                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-700 bg-slate-950 p-4 transition hover:border-slate-600">
                        <input
                          type="radio"
                          name="access"
                          value="selected"
                          checked={access === "selected"}
                          onChange={() => setAccess("selected")}
                          className="mt-0.5"
                        />

                        <div>
                          <p className="text-sm font-medium text-white">
                            Selected
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Allow only selected categories.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Allow List */}
                  {access === "selected" && (
                    <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-white">
                          Allowed Categories
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Select the categories this banquet can access.
                        </p>
                      </div>

                      <div className="space-y-1">
                        {categories
                          .filter((category) => category.enabled)
                          .map((category) => (
                            <label
                              key={category.id}
                              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-900"
                            >
                              <input
                                type="checkbox"
                                checked={allowedCategories.includes(
                                  category.id,
                                )}
                                onChange={() => toggleCategory(category.id)}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-900"
                              />

                              <span className="text-sm text-slate-300">
                                {category.name}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Enabled */}
                  <label className="mt-5 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(event) => setEnabled(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                    />

                    <span className="text-sm text-slate-300">
                      Banquet enabled
                    </span>
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
                    {editingBanquet ? "Save Changes" : "Add Banquet"}
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
