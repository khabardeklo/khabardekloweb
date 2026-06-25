"use client";

import { useState, useRef } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { backendUrl } from "@/lib/config";

type Slide = {
  id: string;
  heading: string;
  body: string;
  imageUrl: string;
  imagePreview: string;
  ctaLabel: string;
  ctaHref: string;
};

const makeSlide = (): Slide => ({
  id: Math.random().toString(36).slice(2),
  heading: "",
  body: "",
  imageUrl: "",
  imagePreview: "",
  ctaLabel: "",
  ctaHref: "",
});

const BG_GRADIENTS = [
  "from-slate-900 to-sky-900",
  "from-violet-900 to-pink-900",
  "from-emerald-900 to-teal-900",
  "from-orange-900 to-red-900",
  "from-indigo-900 to-purple-900",
];

export default function CreateStoryPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("India");
  const [tags, setTags] = useState("");
  const [slides, setSlides] = useState<Slide[]>([makeSlide()]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = slides[activeSlide];

  const updateSlide = (field: keyof Slide, value: string) => {
    setSlides((prev) => prev.map((s, i) => (i === activeSlide ? { ...s, [field]: value } : s)));
  };

  const addSlide = () => {
    const newSlides = [...slides, makeSlide()];
    setSlides(newSlides);
    setActiveSlide(newSlides.length - 1);
  };

  const removeSlide = (idx: number) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== idx);
    setSlides(newSlides);
    setActiveSlide(Math.min(activeSlide, newSlides.length - 1));
  };

  const handleImageUpload = async (file: File, idx: number) => {
    setUploadingIdx(idx);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((res, rej) => {
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error("Read failed"));
        reader.readAsDataURL(file);
      });
      const res = await fetch(`${backendUrl}/uploads/image`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: dataUrl, fileName: file.name, mimeType: file.type }),
      });
      const data = await res.json().catch(() => null) as { url?: string; message?: string } | null;
      if (!res.ok || !data?.url) throw new Error(data?.message || "Upload failed");
      const url = data.url.startsWith("http") ? data.url : `${window.location.origin}${data.url}`;
      setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, imageUrl: url, imagePreview: dataUrl } : s)));
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Image upload failed" });
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSubmit = async (intent: "draft" | "published") => {
    if (!title.trim()) { setMessage({ type: "error", text: "Story title is required." }); return; }
    const hasContent = slides.some((s) => s.heading.trim() || s.imageUrl);
    if (!hasContent) { setMessage({ type: "error", text: "Add at least one slide with a heading or image." }); return; }

    setSubmitting(true); setMessage(null);
    try {
      const content = JSON.stringify({ type: "web-story", slides: slides.map(({ imagePreview: _, ...s }) => s) });
      const res = await fetch(`${backendUrl}/news`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, content, category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          isPublished: intent === "published",
          type: "story",
        }),
      });
      const data = await res.json().catch(() => null) as { message?: string } | null;
      if (!res.ok) throw new Error(data?.message || "Failed to save story");
      setMessage({ type: "success", text: intent === "published" ? "Story published!" : "Story saved as draft!" });
      if (intent === "published") {
        setTitle(""); setCategory("India"); setTags(""); setSlides([makeSlide()]); setActiveSlide(0);
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="Create Story" subtitle="Build a visual web story with multiple slides.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left — Story Builder */}
        <div className="space-y-5">
          {/* Story Meta */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-800">Story Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Story Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter story title..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white">
                  {["India", "Politics", "Business", "Sports", "Entertainment", "Technology", "Health", "World"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Tags (comma separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="news, india, politics..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
            </div>
          </div>

          {/* Slide Thumbnails Row */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Slides ({slides.length}/10)</h3>
              <button onClick={addSlide} disabled={slides.length >= 10}
                className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-sky-700 disabled:opacity-50 active:scale-95">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Add Slide
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {slides.map((slide, idx) => (
                <button key={slide.id} onClick={() => setActiveSlide(idx)}
                  className={`group relative flex-shrink-0 h-20 w-14 rounded-xl overflow-hidden border-2 transition ${activeSlide === idx ? "border-sky-500 shadow-lg shadow-sky-200" : "border-slate-200 hover:border-slate-300"}`}>
                  {slide.imagePreview ? (
                    <img src={slide.imagePreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${BG_GRADIENTS[idx % BG_GRADIENTS.length]} flex items-center justify-center`}>
                      <span className="text-xs font-black text-white">{idx + 1}</span>
                    </div>
                  )}
                  {slides.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                      className="absolute right-0.5 top-0.5 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex">
                      <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Slide Editor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-black text-white">{activeSlide + 1}</span>
              Edit Slide {activeSlide + 1}
            </h3>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Slide Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${current.imagePreview ? "border-transparent" : "border-slate-300 hover:border-sky-400 bg-slate-50"}`}>
                {current.imagePreview ? (
                  <>
                    <img src={current.imagePreview} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition">
                      <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    {uploadingIdx === activeSlide ? (
                      <svg className="h-8 w-8 animate-spin text-sky-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                      <>
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-xs font-medium">Click to upload image</span>
                        <span className="text-[11px]">JPG, PNG, WebP</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, activeSlide); e.target.value = ""; }} />
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Heading</label>
                <input value={current.heading} onChange={(e) => updateSlide("heading", e.target.value)} placeholder="Slide heading..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Body Text</label>
                <textarea value={current.body} onChange={(e) => updateSlide("body", e.target.value)} placeholder="Add a short description..." rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">CTA Label (optional)</label>
                  <input value={current.ctaLabel} onChange={(e) => updateSlide("ctaLabel", e.target.value)} placeholder="Read More"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">CTA Link (optional)</label>
                  <input value={current.ctaHref} onChange={(e) => updateSlide("ctaHref", e.target.value)} placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${message.type === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-rose-200 bg-rose-50 text-rose-700"}`}>
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleSubmit("draft")} disabled={submitting}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-60 active:scale-[0.98]">
              {submitting ? "Saving..." : "Save Draft"}
            </button>
            <button onClick={() => handleSubmit("published")} disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-60 active:scale-[0.98]">
              {submitting ? "Publishing..." : "Publish Story"}
            </button>
          </div>
        </div>

        {/* Right — Live Preview */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Live Preview</h3>
            <div className={`relative mx-auto flex h-[420px] w-[200px] flex-col overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${BG_GRADIENTS[activeSlide % BG_GRADIENTS.length]} shadow-2xl`}>
              {current.imagePreview && (
                <img src={current.imagePreview} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Progress dots */}
              <div className="absolute top-3 left-3 right-3 flex gap-1">
                {slides.map((_, i) => (
                  <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${i === activeSlide ? "bg-white" : "bg-white/40"}`} />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {current.heading && (
                  <h4 className="text-[13px] font-black leading-snug text-white">{current.heading}</h4>
                )}
                {current.body && (
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/80">{current.body}</p>
                )}
                {current.ctaLabel && (
                  <div className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    {current.ctaLabel} →
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              Slide {activeSlide + 1} of {slides.length}
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <h4 className="mb-2 text-xs font-bold text-violet-800">Story Tips</h4>
            <ul className="space-y-2 text-[11px] text-violet-700">
              <li>📱 Stories display in 9:16 vertical format</li>
              <li>✍️ Keep headings short — max 60 chars</li>
              <li>🖼️ Use vivid, high-contrast images</li>
              <li>🔢 Ideal story length: 5–10 slides</li>
              <li>📲 Each slide should be readable in 3 sec</li>
            </ul>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
