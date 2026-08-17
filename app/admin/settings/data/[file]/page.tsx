"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const FILE_MAP: Record<string, string> = {
  channels: "channels.json",
  categories: "categories.json",
  banquet: "banquet.json",
  "iptv-users": "iptv-users.json",
};

export default function DataFilePage() {
  const params = useParams();
  const router = useRouter();

  const fileKey = String(params.file);
  const filename = FILE_MAP[fileKey];

  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  function handleDownload() {
    if (data === null) return;

    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (!filename) {
      setError("Invalid data file.");
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const response = await fetch(
          `/api/admin/data?file=${encodeURIComponent(filename)}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load data.");
        }

        setData(result.data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error ? error.message : "Failed to load data.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filename]);

  if (!filename) {
    return (
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-sm text-red-400">Invalid data file.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/settings")}
            className="mb-3 text-sm text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to Settings
          </button>

          <h1 className="text-2xl font-bold text-white">{filename}</h1>

          <p className="mt-1 text-sm text-slate-400">
            Read-only view of SHAZARO data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={loading || !!error || data === null}
          className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download JSON
        </button>
      </div>

      {/* Content */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Loading data...
          </div>
        ) : error ? (
          <div className="p-8">
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-auto p-6">
            <pre className="min-w-max rounded-lg border border-slate-800 bg-slate-950 p-5 text-sm leading-6 text-slate-300">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
