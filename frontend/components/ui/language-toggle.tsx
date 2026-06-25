"use client";

import { useLang } from "@/lib/language-context";

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5 text-xs font-bold shadow-sm"
      role="group"
      aria-label="Select language"
    >
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-200 ${
          lang === "hi"
            ? "bg-white text-red-600 shadow-sm ring-1 ring-slate-200/80"
            : "text-slate-500 hover:text-slate-700"
        }`}
        aria-label="हिंदी"
        aria-pressed={lang === "hi"}
      >
        हि
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-200 ${
          lang === "en"
            ? "bg-white text-sky-600 shadow-sm ring-1 ring-slate-200/80"
            : "text-slate-500 hover:text-slate-700"
        }`}
        aria-label="English"
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
