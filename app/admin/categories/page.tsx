"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);

  async function loadCategories() {
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openAddModal() {
    setEditingCategory(null);
    setName("");
    setEnabled(true);
    setShowModal(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setEnabled(category.enabled);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setName("");
    setEnabled(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          enabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save category");
      }

      closeModal();
      await loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to save category.");
    }
  }

  async function toggleCategory(category: Category) {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !category.enabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      await loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to update category.");
    }
  }

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(`Delete "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      await loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to delete category.");
    }
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage channel categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          + Add Category
        </button>
      </div>

      {/* =====================================================
          CATEGORY LIST
      ===================================================== */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    ID
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Category
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
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {category.id}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-white">
                        {category.name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {category.enabled ? (
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
                          onClick={() => toggleCategory(category)}
                          className="rounded-lg border border-slate-500/30 px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
                        >
                          {category.enabled ? "Disable" : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
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

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {editingCategory
                    ? "Update category details."
                    : "Create a new category."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-2xl leading-none text-slate-500 transition hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category Name
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Cricket"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(event) => setEnabled(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                />

                <span className="text-sm text-slate-300">Category enabled</span>
              </label>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
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
                  {editingCategory ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
