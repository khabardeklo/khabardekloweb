"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CategoriesMenu } from "./categories-menu";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/lib/language-context";
import type { PublicSiteSettings } from "@/lib/site-settings-api";

type HeaderPageItem = {
  _id: string;
  title: string;
  slug: string;
  menuLabel?: string;
};

type HeaderProps = {
  headerPages: HeaderPageItem[];
  menuPages: HeaderPageItem[];
  siteSettings: PublicSiteSettings;
};

const HEADER_CATEGORIES = [
  { key: "catPolitics" as const, slug: "राजनीति" },
  { key: "catSports" as const, slug: "खेल" },
  { key: "catBusiness" as const, slug: "बिजनेस" },
  { key: "catEntertainment" as const, slug: "मनोरंजन" },
  { key: "catTechnology" as const, slug: "टेक्नोलॉजी" },
  { key: "catHealth" as const, slug: "हेल्थ" },
  { key: "catWorld" as const, slug: "विश्व" },
  { key: "catEducation" as const, slug: "शिक्षा" },
  { key: "catAuto" as const, slug: "ऑटो" },
  { key: "catScience" as const, slug: "साइंस" },
];

export function Header({ headerPages, menuPages, siteSettings }: HeaderProps) {
  const { t } = useLang();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activePrimaryNav = siteSettings.primaryNavLinks.filter((link) => link.isActive !== false);
  const visibleHeaderPages = headerPages.slice(0, Math.max(1, siteSettings.layout.maxHeaderLinks || 5));

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Breaking News Bar */}
      <div className="bg-red-600 text-white overflow-hidden" style={{ height: "36px" }}>
        <div className="mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <span className="mr-3 flex-shrink-0 rounded bg-white px-2 py-0.5 text-[11px] font-black uppercase tracking-widest text-red-600">
            {t.breaking}
          </span>
          <div className="relative flex-1 overflow-hidden">
            <div className="ticker-track text-[13px] font-medium">
              {[...t.breakingItems, ...t.breakingItems].map((item, i) => (
                <span key={i} className="mr-16">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        {/* Top bar — date + social */}
        <div className="hidden border-b border-slate-100 bg-slate-50 lg:block">
          <div className="mx-auto flex h-8 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="text-[11px] font-medium text-slate-500">{currentDate}</span>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="text-slate-400 transition hover:text-blue-600">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter / X" className="text-slate-400 transition hover:text-sky-500">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="text-slate-400 transition hover:text-red-600">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-slate-400 transition hover:text-pink-600">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 min-h-10"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" aria-label={siteSettings.siteName} className="logo-flip-scene mr-2 flex-shrink-0">
            <span className="logo-flip-cube">
              <span className="logo-flip-face">
                <Image
                  src={siteSettings.logoEnglishUrl || "/logo%20english.png"}
                  alt={`${siteSettings.siteName} English`}
                  width={108}
                  height={44}
                  priority
                  className="h-10 w-auto object-contain"
                />
              </span>
              <span className="logo-flip-face logo-flip-face-back">
                <Image
                  src={siteSettings.logoHindiUrl || "/logo%20hindi.png"}
                  alt={`${siteSettings.siteName} Hindi`}
                  width={108}
                  height={44}
                  priority
                  className="h-10 w-auto object-contain"
                />
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {activePrimaryNav.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
            {visibleHeaderPages.map((page) => (
              <Link
                key={page._id}
                href={`/pages/${page.slug}`}
                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {page.menuLabel || page.title}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Language Toggle */}
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            {/* Inline search on desktop */}
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 sm:gap-2 animate-[fadeIn_0.2s_ease-out] flex-1 sm:flex-none">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full sm:w-48 rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 lg:w-64 min-h-10"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-sky-700 min-h-10 whitespace-nowrap"
                >
                  {t.search}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 min-h-10 min-w-10"
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
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 min-h-10"
                aria-label={t.search}
              >
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Nav strip — desktop */}
        <div className="hidden border-t border-slate-100 bg-slate-50 lg:block">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-0.5 overflow-x-auto px-4 py-1 sm:px-6 lg:px-8">
            {HEADER_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${encodeURIComponent(cat.slug)}`}
                className="flex-shrink-0 rounded px-3 py-1.5 text-[13px] font-semibold text-slate-700 transition hover:bg-white hover:text-sky-700"
              >
                {t[cat.key]}
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
