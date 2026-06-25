"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CategoriesMenu } from "./categories-menu";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/lib/language-context";
import type { PublicSiteSettings } from "@/lib/site-settings-api";

type HeaderPageItem = { _id: string; title: string; slug: string; menuLabel?: string };
type HeaderProps = { headerPages: HeaderPageItem[]; menuPages: HeaderPageItem[]; siteSettings: PublicSiteSettings };

const HEADER_CATEGORIES = [
  { key: "catPolitics" as const, slug: "राजनीति", color: "hover:text-amber-600" },
  { key: "catSports" as const, slug: "खेल", color: "hover:text-emerald-600" },
  { key: "catBusiness" as const, slug: "बिजनेस", color: "hover:text-purple-600" },
  { key: "catEntertainment" as const, slug: "मनोरंजन", color: "hover:text-pink-600" },
  { key: "catTechnology" as const, slug: "टेक्नोलॉजी", color: "hover:text-blue-600" },
  { key: "catHealth" as const, slug: "हेल्थ", color: "hover:text-rose-600" },
  { key: "catWorld" as const, slug: "विश्व", color: "hover:text-sky-600" },
  { key: "catEducation" as const, slug: "शिक्षा", color: "hover:text-indigo-600" },
  { key: "catAuto" as const, slug: "ऑटो", color: "hover:text-orange-600" },
  { key: "catScience" as const, slug: "साइंस", color: "hover:text-teal-600" },
];

const MAIN_NAV_TABS = [
  { label: "Articles", labelHi: "आर्टिकल", href: "/articles", color: "hover:text-sky-600", activeColor: "text-sky-600", indicator: "bg-sky-500" },
  { label: "Stories", labelHi: "स्टोरी", href: "/stories", color: "hover:text-pink-600", activeColor: "text-pink-600", indicator: "bg-pink-500" },
  { label: "Education", labelHi: "एजुकेशन", href: "/education", color: "hover:text-emerald-600", activeColor: "text-emerald-600", indicator: "bg-emerald-500" },
  { label: "Jobs", labelHi: "जॉब्स", href: "/jobs", color: "hover:text-orange-600", activeColor: "text-orange-600", indicator: "bg-orange-500" },
];

export function Header({ headerPages, menuPages, siteSettings }: HeaderProps) {
  const { t } = useLang();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activePrimaryNav = siteSettings.primaryNavLinks.filter((link) => link.isActive !== false);
  const visibleHeaderPages = headerPages.slice(0, Math.max(1, siteSettings.layout.maxHeaderLinks || 5));

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <>
      {/* ── Breaking News Bar ───────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: 40, background: "linear-gradient(90deg,#ef4444 0%,#f97316 40%,#ef4444 100%)", backgroundSize: "200% 100%", animation: "shimmerBg 4s linear infinite" }}>
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
          <span className="flex h-full flex-shrink-0 items-center gap-2 bg-black/20 px-4 text-[11px] font-black uppercase tracking-widest text-white border-r border-white/20">
            <span className="pulse-dot" />
            {t.breaking}
          </span>
          <div className="relative flex-1 overflow-hidden mx-3">
            {/* Double-clone for seamless loop */}
            <div className="ticker-track text-[13px] font-medium text-white/95">
              {[...t.breakingItems, ...t.breakingItems].map((item, i) => (
                <span key={i} className="mr-14">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Header ─────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(99,102,241,0.12)] border-b border-indigo-50" : "shadow-[0_1px_0_#e2e8f0]"
        }`}
      >
        {/* Top info bar */}
        <div className="hidden border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/50 lg:block">
          <div className="mx-auto flex h-8 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {currentDate}
            </span>
            <div className="flex items-center gap-2">
              {[
                { label: "Facebook", href: "#", color: "hover:text-blue-600 hover:bg-blue-50", icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
                { label: "Twitter / X", href: "#", color: "hover:text-sky-500 hover:bg-sky-50", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                { label: "YouTube", href: "#", color: "hover:text-red-600 hover:bg-red-50", icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
                { label: "Instagram", href: "#", color: "hover:text-pink-600 hover:bg-pink-50", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-all ${s.color}`}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Nav Row */}
        <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-2 sm:h-16 sm:gap-3 px-4 sm:px-6 lg:px-8">
          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 7h16M4 12h10M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" aria-label={siteSettings.siteName} className="logo-flip-scene flex-shrink-0 ml-1 mr-2">
            <span className="logo-flip-cube">
              <span className="logo-flip-face">
                <Image
                  src={siteSettings.logoEnglishUrl || "/logo%20english.png"}
                  alt={`${siteSettings.siteName} English`}
                  width={112} height={44} priority
                  className="h-9 w-auto object-contain"
                />
              </span>
              <span className="logo-flip-face logo-flip-face-back">
                <Image
                  src={siteSettings.logoHindiUrl || "/logo%20hindi.png"}
                  alt={`${siteSettings.siteName} Hindi`}
                  width={112} height={44} priority
                  className="h-9 w-auto object-contain"
                />
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            {MAIN_NAV_TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`group relative rounded-lg px-3.5 py-2 text-[13px] font-bold text-slate-700 transition ${tab.color}`}
              >
                {tab.label}
                <span className={`absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full ${tab.indicator} scale-x-0 transition-transform duration-200 group-hover:scale-x-100`} />
              </Link>
            ))}
            {activePrimaryNav.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
            {visibleHeaderPages.map((page) => (
              <Link
                key={page._id}
                href={`/pages/${page.slug}`}
                className="rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {page.menuLabel || page.title}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Language */}
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-[fadeIn_0.2s_ease-out] flex-1 sm:flex-none">
                <div className="relative flex-1 sm:flex-none">
                  <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full sm:w-52 lg:w-64 rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <button type="submit" className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-95">
                  {t.search}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                  aria-label={t.closeSearch}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                aria-label={t.search}
              >
                <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Nav Strip */}
        <div className="hidden border-t border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/40 lg:block">
          <div className="mx-auto flex w-full max-w-[1400px] items-center gap-0 overflow-x-auto px-4 sm:px-6 lg:px-8 scrollbar-none">
            {HEADER_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${encodeURIComponent(cat.slug)}`}
                className={`group relative flex-shrink-0 px-3.5 py-2.5 text-[12.5px] font-bold text-slate-600 transition-all hover:text-indigo-600 ${cat.color}`}
              >
                {t[cat.key]}
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>
      </header>

      <CategoriesMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuPages={menuPages}
        sideMenuLinks={siteSettings.sideMenuLinks}
        isCategoryMenuVisible={siteSettings.layout.showCategoryMenu}
        maxSideMenuLinks={siteSettings.layout.maxSideMenuLinks}
      />
    </>
  );
}
