"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CategoriesMenu } from "./categories-menu";

type HeaderPageItem = {
  _id: string;
  title: string;
  slug: string;
  menuLabel?: string;
};

type HeaderProps = {
  headerPages: HeaderPageItem[];
  menuPages: HeaderPageItem[];
};

export function Header({ headerPages, menuPages }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-800 transition-colors hover:bg-slate-100"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.25">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <Link href="/" aria-label="Khabar Deklo" className="logo-flip-scene">
            <span className="logo-flip-cube">
              <span className="logo-flip-face">
                <Image
                  src="/logo%20english.png"
                  alt="Khabar Deklo English logo"
                  width={108}
                  height={48}
                  priority
                  className="h-12 w-auto object-contain"
                />
              </span>
              <span className="logo-flip-face logo-flip-face-back">
                <Image
                  src="/logo%20hindi.png"
                  alt="Khabar Deklo Hindi logo"
                  width={108}
                  height={48}
                  priority
                  className="h-12 w-auto object-contain"
                />
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-2 lg:flex">
            {headerPages.slice(0, 5).map((page) => (
              <Link
                key={page._id}
                href={`/pages/${page.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              >
                {page.menuLabel || page.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <CategoriesMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} menuPages={menuPages} />
    </>
  );
}