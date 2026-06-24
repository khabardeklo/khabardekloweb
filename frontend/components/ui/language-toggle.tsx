"use client";

import { useLang } from "@/lib/language-context";

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={`rounded-md px-2.5 py-1.5 transition-all min-h-0 min-w-0 ${
          lang === "hi"
            ? "bg-white text-red-600 shadow-sm"
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
        className={`rounded-md px-2.5 py-1.5 transition-all min-h-0 min-w-0 ${
          lang === "en"
            ? "bg-white text-sky-600 shadow-sm"
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
