"use client";

import { useEffect, useState } from "react";
import type { Channel, Category } from "@/lib/types";

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedStreamUrl, setCopiedStreamUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [form, setForm] = useState({
    name: "",
    stream_type: "live" as Channel["stream_type"],
    streamUrl: "",
    logoUrl: "",
    categoryId: "",
    enabled: true,
  });

  async function loadData() {
    try {
      const [channelsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/channels"),
        fetch("/api/categories"),
      ]);

      const channelsData = await channelsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setChannels(channelsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load channels:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateForm(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this channel?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/channels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete channel");
      }

      await loadData();
    } catch (error) {
      console.error("Delete channel failed:", error);
      alert("Failed to delete channel.");
    }
  }

  async function handleToggleEnabled(channel: Channel) {
    const action = channel.enabled ? "disable" : "enable";

    if (
      channel.enabled &&
      !window.confirm(`Are you sure you want to disable "${channel.name}"?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/channels/${channel.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: channel.name,
          stream_type: channel.stream_type,
          streamUrl: channel.streamUrl,
          logoUrl: channel.logoUrl,
          categoryId: channel.categoryId,
          enabled: !channel.enabled,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} channel`);
      }

      await loadData();
    } catch (error) {
      console.error(`${action} channel failed:`, error);
      alert(`Failed to ${action} channel.`);
    }
  }

  function handleEdit(channel: Channel) {
    setEditingChannel(channel);

    setForm({
      name: channel.name,
      stream_type: channel.stream_type,
      streamUrl: channel.streamUrl,
      logoUrl: channel.logoUrl,
      categoryId: String(channel.categoryId),
      enabled: channel.enabled,
    });

    setShowModal(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch(
        editingChannel ? `/api/channels/${editingChannel.id}` : "/api/channels",
        {
          method: editingChannel ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            stream_type: form.stream_type,
            streamUrl: form.streamUrl,
            logoUrl: form.logoUrl,
            categoryId: Number(form.categoryId),
            enabled: form.enabled,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          editingChannel
            ? "Failed to update channel"
            : "Failed to create channel",
        );
      }

      setShowModal(false);
      setEditingChannel(null);

      setForm({
        name: "",
        stream_type: "live",
        streamUrl: "",
        logoUrl: "",
        categoryId: "",
        enabled: true,
      });

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        editingChannel
          ? "Failed to update channel."
          : "Failed to create channel.",
      );
    }
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Channels</h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your IPTV channels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingChannel(null);
            setShowModal(true);
          }}
          className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          + Add Channel
        </button>
      </div>

      {/* =====================================================
          CHANNEL LIST
      ===================================================== */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {/* =====================================================
    CHANNEL SEARCH
===================================================== */}
        {!loading && channels.length > 0 && (
          <div className="border-b border-slate-800 p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search channel name..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Loading channels...
          </div>
        ) : channels.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">No channels found.</p>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Add your first channel
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Channel
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Stream ID
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Stream URL
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Type
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
                {channels
                  .filter((channel) =>
                    channel.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((channel) => {
                    const category = categories.find(
                      (item) => item.id === channel.categoryId,
                    );

                    return (
                      <tr
                        key={channel.id}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
                              {channel.logoUrl ? (
                                <img
                                  src={channel.logoUrl}
                                  alt=""
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <span className="text-xs font-bold text-slate-500">
                                  TV
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">
                                {channel.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                ID: {channel.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {channel.streamId}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                channel.streamUrl,
                              );
                              setCopiedStreamUrl(channel.streamUrl);

                              setTimeout(() => {
                                setCopiedStreamUrl(null);
                              }, 1500);
                            }}
                            className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300"
                          >
                            {copiedStreamUrl === channel.streamUrl
                              ? "Stream Copied!"
                              : "Copy Stream"}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-sm font-medium capitalize text-slate-300">
                            {channel.stream_type}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {category?.name ?? "Unknown"}
                        </td>

                        <td className="px-5 py-4">
                          {channel.enabled ? (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                              Enabled
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                              Disabled
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEdit(channel)}
                              className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300"
                            >
                              Edit
                            </button>

                            {/* Enable / Disable */}
                            <button
                              type="button"
                              onClick={() => handleToggleEnabled(channel)}
                              className={
                                channel.enabled
                                  ? "rounded-lg border border-amber-500/30 px-3 py-1.5 text-sm font-medium text-amber-400 transition hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-300"
                                  : "rounded-lg border border-emerald-500/30 px-3 py-1.5 text-sm font-medium text-emerald-400 transition hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300"
                              }
                            >
                              {channel.enabled ? "Disable" : "Enable"}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(channel.id)}
                              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300"
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

      {/* =====================================================
          ADD CHANNEL MODAL
      ===================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingChannel ? "Edit Channel" : "Add Channel"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {editingChannel
                    ? "Update channel details."
                    : "Add a new IPTV channel."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none text-slate-500 transition hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Channel Name */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Channel Name
                  </label>

                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="Example Channel"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  />
                </div>

                {/* Stream ID */}

                {/* Stream Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Stream Type
                  </label>

                  <select
                    value={form.stream_type}
                    onChange={(event) =>
                      updateForm("stream_type", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  >
                    <option value="live">Live</option>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>

                  <select
                    required
                    value={form.categoryId}
                    onChange={(event) =>
                      updateForm("categoryId", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  >
                    <option value="">Select category</option>

                    {categories
                      .filter((category) => category.enabled)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Logo URL
                  </label>

                  <input
                    type="url"
                    value={form.logoUrl}
                    onChange={(event) =>
                      updateForm("logoUrl", event.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  />
                </div>

                {/* Stream URL */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Stream URL
                  </label>

                  <input
                    type="url"
                    required
                    value={form.streamUrl}
                    onChange={(event) =>
                      updateForm("streamUrl", event.target.value)
                    }
                    placeholder="https://example.com/live/1001/manifest.m3u8"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  />
                </div>

                {/* Enabled */}
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.enabled}
                      onChange={(event) =>
                        updateForm("enabled", event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                    />

                    <span className="text-sm text-slate-300">
                      Channel enabled
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  {editingChannel ? "Save Changes" : "Add Channel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
