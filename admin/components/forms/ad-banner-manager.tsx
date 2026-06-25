"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type AdBanner = {
  _id: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl: string;
  isActive: boolean;
  position: number;
};

type AdFormState = {
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl: string;
  isActive: boolean;
};

import { backendUrl } from "@/lib/config";

const initialForm: AdFormState = {
  title: "",
  description: "",
  ctaLabel: "",
  targetUrl: "https://",
  isActive: true,
};

export function AdBannerManager() {
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [form, setForm] = useState<AdFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const dragRef = useRef<string | null>(null);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const loadAds = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/ads`, {
        credentials: "include",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "Unable to load ad banners");
      }

      const data = (await response.json()) as AdBanner[];
      setAds(data.sort((a, b) => a.position - b.position));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load ad banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAds();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(editingId ? `${backendUrl}/ads/${editingId}` : `${backendUrl}/ads`, {
        method: editingId ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save ad banner");
      }

      setMessage(editingId ? "Ad banner updated." : "Ad banner created.");
      resetForm();
      await loadAds();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save ad banner");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ad: AdBanner) => {
    setForm({
      title: ad.title,
      description: ad.description,
      ctaLabel: ad.ctaLabel,
      targetUrl: ad.targetUrl,
      isActive: ad.isActive,
    });
    setEditingId(ad._id);
    setMessage(null);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${backendUrl}/ads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete ad banner");
      }

      setMessage("Ad banner deleted.");
      if (editingId === id) {
        resetForm();
      }
      await loadAds();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete ad banner");
    }
  };

  const handleDragStart = (id: string) => {
    dragRef.current = id;
    setDraggedId(id);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (targetId: string) => {
    if (!dragRef.current || dragRef.current === targetId) {
      return;
    }

    const sourceIndex = ads.findIndex((ad) => ad._id === dragRef.current);
    const targetIndex = ads.findIndex((ad) => ad._id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }

    const newAds = [...ads];
    const [movedAd] = newAds.splice(sourceIndex, 1);
    newAds.splice(targetIndex, 0, movedAd);

    setAds(newAds);

    try {
      const reorderPayload = {
        ads: newAds.map((ad, index) => ({
          id: ad._id,
          position: index,
        })),
      };

      const response = await fetch(`${backendUrl}/ads/reorder`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reorderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder ads");
      }

      setMessage("Ad banners reordered.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to reorder ads");
      await loadAds();
    } finally {
      setDraggedId(null);
      dragRef.current = null;
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Ad Banner Manager</h2>
          <p className="mt-1 text-sm text-slate-600">Create and manage homepage right-rail ad banners. Drag to reorder.</p>
        </div>
        {isEditing ? (
          <Button type="button" className="bg-white px-4 text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100" onClick={resetForm}>
            Cancel edit
          </Button>
        ) : null}
      </div>

      {message ? <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="Banner title"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          required
        />
        <textarea
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="Banner description"
          rows={3}
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            placeholder="CTA label"
            value={form.ctaLabel}
            onChange={(event) => setForm((current) => ({ ...current, ctaLabel: event.target.value }))}
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            placeholder="Target URL"
            value={form.targetUrl}
            onChange={(event) => setForm((current) => ({ ...current, targetUrl: event.target.value }))}
            required
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
          />
          Active banner
        </label>
        <div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Existing banners</h3>
        {loading ? <p className="text-sm text-slate-600">Loading banners...</p> : null}
        {!loading && ads.length === 0 ? <p className="text-sm text-slate-600">No banners found.</p> : null}
        {ads.map((ad, index) => (
          <article
            key={ad._id}
            draggable
            onDragStart={() => handleDragStart(ad._id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(ad._id)}
            className={`cursor-move rounded-2xl border border-slate-200 p-4 transition-opacity ${
              draggedId === ad._id ? "opacity-50" : "opacity-100"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400">≡ Position {ad.position}</p>
                <h4 className="font-bold text-slate-950">{ad.title}</h4>
                <p className="mt-1 text-sm text-slate-600">{ad.description}</p>
                <p className="mt-2 text-xs text-slate-500">CTA: {ad.ctaLabel} | URL: {ad.targetUrl}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {ad.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="bg-white px-4 text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100"
                  onClick={() => handleEdit(ad)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="bg-rose-600 px-4 text-white hover:bg-rose-700"
                  onClick={() => void handleDelete(ad._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
