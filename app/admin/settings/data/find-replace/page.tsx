"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FILES = [
  {
    value: "channels.json",
    label: "channels.json",
  },
  {
    value: "categories.json",
    label: "categories.json",
  },
  {
    value: "banquet.json",
    label: "banquet.json",
  },
  {
    value: "iptv-users.json",
    label: "iptv-users.json",
  },
];

const FIELDS = [
  {
    value: "streamUrl",
    label: "streamUrl",
  },
  {
    value: "name",
    label: "name",
  },
  {
    value: "logoUrl",
    label: "logoUrl",
  },
  {
    value: "categoryId",
    label: "categoryId",
  },
];

type Match = {
  index: number;
  field: string;
  before: string;
  after: string;
};

export default function FindReplacePage() {
  const router = useRouter();

  const [filename, setFilename] = useState("channels.json");

  const [field, setField] = useState("streamUrl");

  const [find, setFind] = useState("");

  const [replace, setReplace] = useState("");

  const [matches, setMatches] = useState<Match[]>([]);

  const [previewed, setPreviewed] = useState(false);

  const [loading, setLoading] = useState(false);

  const [applying, setApplying] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // PREVIEW CHANGES
  // =====================================================

  async function handlePreview() {
    setError("");
    setSuccess("");
    setMatches([]);
    setPreviewed(false);

    if (!find.trim()) {
      setError("Please enter a value to find.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/data/find-replace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          find,
          replace,
          field,
          mode: "preview",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to preview changes.");
      }

      setMatches(Array.isArray(result.matches) ? result.matches : []);

      setPreviewed(true);

      if (!result.matches || result.matches.length === 0) {
        setSuccess("No matching values were found.");
      }
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to preview changes.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // APPLY CHANGES
  // =====================================================

  async function handleApply() {
    if (!previewed || matches.length === 0) {
      return;
    }

    setError("");
    setSuccess("");
    setApplying(true);

    try {
      const response = await fetch("/api/data/find-replace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          find,
          replace,
          field,
          mode: "apply",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to apply changes.");
      }

      setSuccess(
        `${result.matchCount || matches.length} change${
          (result.matchCount || matches.length) === 1 ? "" : "s"
        } applied successfully.`,
      );

      // Clear preview after successful apply.
      setMatches([]);
      setPreviewed(false);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to apply changes.",
      );
    } finally {
      setApplying(false);
    }
  }

  // =====================================================
  // RESET
  // =====================================================

  function handleReset() {
    setFind("");
    setReplace("");
    setMatches([]);
    setPreviewed(false);
    setError("");
    setSuccess("");
  }

  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/settings")}
          className="mb-3 text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Settings
        </button>

        <h1 className="text-2xl font-bold text-white">Find & Replace</h1>

        <p className="mt-1 text-sm text-slate-400">
          Find and replace values in SHAZARO JSON data.
        </p>
      </div>

      {/* =====================================================
          FIND & REPLACE FORM
      ===================================================== */}

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">Find & Replace</h2>

          <p className="mt-1 text-sm text-slate-400">
            Preview your changes before writing them to SHAZARO data storage.
          </p>
        </div>

        <div className="space-y-6 p-6">
          {/* File */}

          <div>
            <label
              htmlFor="filename"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Data File
            </label>

            <select
              id="filename"
              value={filename}
              onChange={(event) => {
                setFilename(event.target.value);
                setMatches([]);
                setPreviewed(false);
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
            >
              {FILES.map((file) => (
                <option key={file.value} value={file.value}>
                  {file.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Field */}

          <div>
            <label
              htmlFor="field"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Search Field
            </label>

            <select
              id="field"
              value={field}
              onChange={(event) => {
                setField(event.target.value);
                setMatches([]);
                setPreviewed(false);
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
            >
              {FIELDS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Only the selected JSON field will be searched.
            </p>
          </div>

          {/* Find */}

          <div>
            <label
              htmlFor="find"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Find
            </label>

            <input
              id="find"
              type="text"
              value={find}
              onChange={(event) => {
                setFind(event.target.value);
                setMatches([]);
                setPreviewed(false);
                setError("");
                setSuccess("");
              }}
              placeholder="Enter value to find"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-500"
            />
          </div>

          {/* Replace */}

          <div>
            <label
              htmlFor="replace"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Replace
            </label>

            <input
              id="replace"
              type="text"
              value={replace}
              onChange={(event) => {
                setReplace(event.target.value);
                setMatches([]);
                setPreviewed(false);
                setError("");
                setSuccess("");
              }}
              placeholder="Enter replacement value"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Leave empty if you intentionally want to remove the matching
              value.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-400">{success}</p>
            </div>
          )}

          {/* Actions */}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={handlePreview}
              disabled={loading || applying || !find.trim()}
              className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Previewing..." : "Preview Changes"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading || applying}
              className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PREVIEW RESULTS
      ===================================================== */}

      {previewed && (
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Preview Changes
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {matches.length} {matches.length === 1 ? "match" : "matches"}{" "}
                  found.
                </p>
              </div>

              {matches.length > 0 && (
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                  Not applied yet
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {matches.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-center">
                <p className="text-sm text-slate-400">
                  No matching values were found.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={`${match.index}-${index}`}
                      className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
                    >
                      <div className="border-b border-slate-800 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Record {match.index + 1}
                          {" · "}
                          {match.field}
                        </p>
                      </div>

                      <div className="grid gap-4 p-4 lg:grid-cols-2">
                        {/* Before */}

                        <div>
                          <p className="mb-2 text-xs font-medium text-red-400">
                            Before
                          </p>

                          <div className="overflow-x-auto rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                            <code className="break-all text-sm leading-6 text-slate-300">
                              {match.before}
                            </code>
                          </div>
                        </div>

                        {/* After */}

                        <div>
                          <p className="mb-2 text-xs font-medium text-emerald-400">
                            After
                          </p>

                          <div className="overflow-x-auto rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                            <code className="break-all text-sm leading-6 text-slate-300">
                              {match.after}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Apply */}

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Ready to apply?
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      This will write the changes to {filename}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying}
                    className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {applying ? "Applying..." : "Apply Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
