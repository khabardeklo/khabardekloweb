"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminShell } from "@/components/layout/admin-shell";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

type PreviewArticle = {
  title: string;
  content: string;
  description: string;
  imageUrl?: string;
  sourceUrl?: string;
};

type ImportResult = {
  message: string;
  imported: number;
  skipped: number;
  errors: string[];
};

type ApiSource = {
  _id: string;
  name: string;
  apiUrl: string;
  apiKey?: string;
  category: string;
  intervalMinutes: number;
  publishImmediately: boolean;
  isActive: boolean;
  lastFetchedAt?: string;
  lastFetchResult?: string;
};

const INTERVALS = [
  { label: "Every 30 min", value: 30 },
  { label: "Every 1 hour", value: 60 },
  { label: "Every 2 hours", value: 120 },
  { label: "Every 6 hours", value: 360 },
  { label: "Every 12 hours", value: 720 },
  { label: "Every 24 hours", value: 1440 },
];

export default function ImportNewsPage() {
  const [activeTab, setActiveTab] = useState<"manual" | "saved">("saved");

  // ── Saved Sources State ──────────────────────────────
  const [sources, setSources] = useState<ApiSource[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [fetchResult, setFetchResult] = useState<{ id: string; result: ImportResult } | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    apiUrl: "",
    apiKey: "",
    category: "India",
    intervalMinutes: 60,
    publishImmediately: false,
  });
  const [savingSource, setSavingSource] = useState(false);

  // ── Manual Import State ──────────────────────────────
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [category, setCategory] = useState("India");
  const [publishImmediately, setPublishImmediately] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewArticles, setPreviewArticles] = useState<PreviewArticle[] | null>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Load saved sources ───────────────────────────────
  const loadSources = useCallback(async () => {
    setLoadingSources(true);
    try {
      const res = await fetch(`${backendUrl}/api-sources`, { credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/login/super-admin";
        return;
      }
      if (res.ok) setSources(await res.json() as ApiSource[]);
    } finally {
      setLoadingSources(false);
    }
  }, []);

  useEffect(() => { void loadSources(); }, [loadSources]);

  const handleSaveSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSource(true);
    try {
      const res = await fetch(`${backendUrl}/api-sources`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSource),
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewSource({ name: "", apiUrl: "", apiKey: "", category: "India", intervalMinutes: 60, publishImmediately: false });
        void loadSources();
      }
    } finally {
      setSavingSource(false);
    }
  };

  const handleToggleActive = async (source: ApiSource) => {
    await fetch(`${backendUrl}/api-sources/${source._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !source.isActive }),
    });
    void loadSources();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Iss API source ko delete karna chahte hain?")) return;
    await fetch(`${backendUrl}/api-sources/${id}`, { method: "DELETE", credentials: "include" });
    void loadSources();
  };

  const handleFetchNow = async (source: ApiSource) => {
    setFetchingId(source._id);
    setFetchResult(null);
    try {
      const res = await fetch(`${backendUrl}/api-sources/${source._id}/fetch-now`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json() as ImportResult;
      setFetchResult({ id: source._id, result: data });
      void loadSources();
    } finally {
      setFetchingId(null);
    }
  };

  // ── Manual Preview/Import ────────────────────────────
  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewing(true);
    setPreviewArticles(null);
    setResult(null);
    setError(null);
    setSelectedIndexes(new Set());
    try {
      const params = new URLSearchParams();
      params.set("apiUrl", apiUrl.trim());
      if (apiKey.trim()) params.set("apiKey", apiKey.trim());
      const res = await fetch(`${backendUrl}/news/preview-from-api?${params.toString()}`, { credentials: "include" });
      const data = await res.json() as { previews?: PreviewArticle[]; message?: string };
      if (!res.ok) { setError(data.message || "Failed"); return; }
      const articles = data.previews ?? [];
      if (articles.length === 0) { setError("API se koi article nahi mila. URL aur key check karein."); return; }
      setPreviewArticles(articles);
      setSelectedIndexes(new Set(articles.map((_, i) => i)));
    } catch (err) {
      setError(`Network error: ${String(err)}`);
    } finally {
      setPreviewing(false);
    }
  };

  const toggleSelect = (index: number) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handleImport = async () => {
    if (!previewArticles || selectedIndexes.size === 0) return;
    setImporting(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/news/import-from-api`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiUrl: apiUrl.trim(),
          apiKey: apiKey.trim() || undefined,
          category: category.trim(),
          publishImmediately,
          selectedIndexes: Array.from(selectedIndexes),
        }),
      });
      const data = await res.json() as ImportResult;
      if (!res.ok) { setError((data as { message?: string }).message || "Import failed"); return; }
      setResult(data);
      setPreviewArticles(null);
      setSelectedIndexes(new Set());
    } catch (err) {
      setError(`Network error: ${String(err)}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <AdminShell
      title="Import News from API"
      subtitle="API sources save karein — auto-fetch se news apne aap backend me save hoti rahegi."
    >
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 mb-6 w-fit">
        {(["saved", "manual"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "saved" ? "📡 Saved API Sources" : "🔍 Manual Import"}
          </button>
        ))}
      </div>

      {/* ── SAVED SOURCES TAB ── */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Saved sources se news automatically fetch hoti rahti hai. Active toggle se on/off kar sakte hain.
            </p>
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              + New Source
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form
              onSubmit={(e) => void handleSaveSource(e)}
              className="rounded-2xl border border-blue-200 bg-blue-50 p-5 space-y-4"
            >
              <h3 className="text-sm font-bold text-blue-900">Naya API Source Add Karein</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Source Name *</label>
                  <input required value={newSource.name} onChange={(e) => setNewSource((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. India Headlines" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category *</label>
                  <input required value={newSource.category} onChange={(e) => setNewSource((p) => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. India, Sports" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">API URL * (key URL me hi daalna best hai)</label>
                  <input required type="url" value={newSource.apiUrl} onChange={(e) => setNewSource((p) => ({ ...p, apiUrl: e.target.value }))}
                    placeholder="https://newsapi.org/v2/top-headlines?country=in&pageSize=10&apiKey=YOUR_KEY"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">API Key Header <span className="font-normal text-slate-400">(optional)</span></label>
                  <input value={newSource.apiKey} onChange={(e) => setNewSource((p) => ({ ...p, apiKey: e.target.value }))}
                    placeholder="X-Api-Key header ke liye" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Auto-Fetch Interval</label>
                  <select value={newSource.intervalMinutes} onChange={(e) => setNewSource((p) => ({ ...p, intervalMinutes: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {INTERVALS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newSource.publishImmediately}
                  onChange={(e) => setNewSource((p) => ({ ...p, publishImmediately: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                <span className="text-sm text-slate-700">Auto-fetched news immediately publish karein <span className="text-xs text-slate-400">(unchecked = Draft)</span></span>
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={savingSource}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition">
                  {savingSource ? "Saving..." : "💾 Save & Activate"}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Sources List */}
          {loadingSources ? (
            <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
          ) : sources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
              <p className="text-slate-500 text-sm">Abhi koi saved API source nahi hai.</p>
              <p className="text-xs text-slate-400 mt-1">&#34;+ New Source&#34; button se pehla source add karein.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source) => (
                <div key={source._id} className={`rounded-2xl border p-4 space-y-3 transition ${source.isActive ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${source.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                          {source.isActive ? "🟢 Active" : "⏸ Paused"}
                        </span>
                        <span className="text-sm font-bold text-slate-800">{source.name}</span>
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">{source.category}</span>
                        <span className="text-xs text-slate-500">
                          🕒 {INTERVALS.find((i) => i.value === source.intervalMinutes)?.label ?? `${source.intervalMinutes}min`}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 font-mono truncate max-w-lg">{source.apiUrl}</p>
                      {source.lastFetchedAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          Last fetch: {new Date(source.lastFetchedAt).toLocaleString("hi-IN")}
                          {source.lastFetchResult && <span className="ml-2 text-slate-600">{source.lastFetchResult}</span>}
                        </p>
                      )}
                      {fetchResult?.id === source._id && (
                        <p className="mt-1 text-xs font-semibold text-blue-700">
                          ✅ {fetchResult.result.message} ({fetchResult.result.imported} imported, {fetchResult.result.skipped} skipped)
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => void handleFetchNow(source)} disabled={fetchingId === source._id}
                        className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50 transition">
                        {fetchingId === source._id ? "⏳ Fetching..." : "⚡ Fetch Now"}
                      </button>
                      <button onClick={() => void handleToggleActive(source)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${source.isActive ? "border-amber-300 bg-white text-amber-700 hover:bg-amber-50" : "border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"}`}>
                        {source.isActive ? "⏸ Pause" : "▶ Activate"}
                      </button>
                      <button onClick={() => void handleDelete(source._id)}
                        className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MANUAL IMPORT TAB ── */}
      {activeTab === "manual" && (
        <div className="space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">⚠️ {error}</div>
          )}
          {result && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 space-y-2">
              <p className="text-sm font-bold text-emerald-800">✅ {result.message}</p>
              <div className="flex gap-6 text-sm">
                <span className="text-emerald-700">Imported: <strong>{result.imported}</strong></span>
                <span className="text-amber-700">Skipped: <strong>{result.skipped}</strong></span>
              </div>
              <a href="/posts" className="inline-block mt-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition">
                View Imported Posts →
              </a>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-800">One-time Manual Import</h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { label: "🇮🇳 India Headlines", url: "https://newsapi.org/v2/top-headlines?country=in&pageSize=10&apiKey=" },
                { label: "💻 Technology", url: "https://newsapi.org/v2/top-headlines?category=technology&country=in&pageSize=10&apiKey=" },
                { label: "⚽ Sports", url: "https://newsapi.org/v2/top-headlines?category=sports&country=in&pageSize=10&apiKey=" },
              ].map((p) => (
                <button key={p.url} type="button" onClick={() => { setApiUrl(p.url); setPreviewArticles(null); setResult(null); setError(null); }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition">
                  {p.label}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => void handlePreview(e)} className="space-y-4">
              <input type="url" required value={apiUrl} onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://newsapi.org/v2/top-headlines?country=in&pageSize=10&apiKey=YOUR_KEY"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API Key (optional — header)"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={previewing || !apiUrl.trim()}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition">
                {previewing ? "⏳ Fetching..." : "🔍 Fetch & Preview"}
              </button>
            </form>
          </div>

          {previewArticles && previewArticles.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">{previewArticles.length} articles · {selectedIndexes.size} selected</p>
                <button onClick={() => setSelectedIndexes(selectedIndexes.size === previewArticles.length ? new Set() : new Set(previewArticles.map((_, i) => i)))}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  {selectedIndexes.size === previewArticles.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {previewArticles.map((article, index) => {
                  const selected = selectedIndexes.has(index);
                  return (
                    <div key={index} onClick={() => toggleSelect(index)}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${selected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50 opacity-60"}`}>
                      <input type="checkbox" checked={selected} onChange={() => toggleSelect(index)} onClick={(e) => e.stopPropagation()}
                        className="mt-1 h-4 w-4 flex-shrink-0" />
                      {article.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.imageUrl} alt="" className="h-14 w-20 flex-shrink-0 rounded-lg object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{article.title}</p>
                        {article.description && <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{article.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={publishImmediately} onChange={(e) => setPublishImmediately(e.target.checked)} className="h-4 w-4 rounded" />
                  <span className="text-sm text-slate-700">Immediately publish <span className="text-xs text-slate-400">(unchecked = Draft)</span></span>
                </label>
                <button onClick={() => void handleImport()} disabled={importing || selectedIndexes.size === 0}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition">
                  {importing ? "⏳ Importing..." : `📥 Import ${selectedIndexes.size} Article${selectedIndexes.size !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
