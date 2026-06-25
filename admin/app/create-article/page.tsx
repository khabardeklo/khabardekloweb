"use client";

import { Suspense, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { ReporterNewsForm } from "@/components/forms/reporter-news-form";

const ARTICLE_TIPS = [
  { icon: "🎯", text: "Write a clear, specific headline under 80 characters." },
  { icon: "🖼️", text: "Add a high-quality featured image for better engagement." },
  { icon: "📝", text: "Use H2/H3 headings to structure long articles." },
  { icon: "🏷️", text: "Add relevant tags to improve discoverability." },
];

function CreateArticleContent() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <AdminShell title="Create Article" subtitle="Write and publish a new article with the rich text editor.">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Form */}
        <div>
          {submitted && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Article published successfully!
            </div>
          )}
          <ReporterNewsForm
            authorName="Admin"
            onSuccess={() => setSubmitted(true)}
          />
        </div>

        {/* Sidebar Tips */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-sky-900">
              <svg className="h-4 w-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Writing Tips
            </h3>
            <ul className="space-y-3">
              {ARTICLE_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-sky-800">
                  <span className="text-base leading-4">{tip.icon}</span>
                  <span className="leading-relaxed">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-slate-800">Article Checklist</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {["Compelling headline written", "Description / SEO summary added", "Category selected", "Tags added (3–5 recommended)", "Featured image uploaded", "Content proofread", "Schedule or publish time set"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 border-slate-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-xs font-semibold text-amber-800">
              💡 <strong>Pro tip:</strong> Save as Draft first, then review before publishing to avoid mistakes.
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

export default function CreateArticlePage() {
  return (
    <Suspense fallback={
      <AdminShell title="Create Article" subtitle="Loading editor...">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          Loading editor...
        </div>
      </AdminShell>
    }>
      <CreateArticleContent />
    </Suspense>
  );
}
