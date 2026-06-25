'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useLang } from '@/lib/language-context';

const categories = [
  'धर्म', 'खेल', 'लाइफस्टाइल', 'वेब स्टोरी', 'वीडियो', 'बिजनेस',
  'AI', 'इन्फॉर्मेशन', 'विश्व', 'जुर्म', 'टेक्नोलॉजी', 'पिछले चुनाव',
  'सैर-सपाटा', 'एजुकेशन', 'डिफेंस न्यूज', 'कला-संस्कृति', 'Explained',
  'साइंस न्यूज़', 'ऑटो', 'ट्रेंडिंग', 'फैक्ट चेक', 'हेल्थ', 'फोटो',
  'मौसम', 'गेम्स',
];

type CategoriesMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuPages: Array<{ _id: string; title: string; slug: string; menuLabel?: string }>;
  sideMenuLinks: Array<{ label: string; href: string; isActive: boolean }>;
  isCategoryMenuVisible: boolean;
  maxSideMenuLinks: number;
};

export function CategoriesMenu({ isOpen, onClose, menuPages, sideMenuLinks, isCategoryMenuVisible, maxSideMenuLinks }: CategoriesMenuProps) {
  const { t } = useLang();
  const visibleSideMenuLinks = sideMenuLinks
    .filter((link) => link.isActive !== false)
    .slice(0, Math.max(1, maxSideMenuLinks || 16));

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        role="presentation"
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[88vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/20">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-sky-400" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-300">{t.menu}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/80 text-slate-400 transition hover:bg-slate-600 hover:text-white active:scale-95"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <nav className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>

          {/* Quick Links section */}
          {visibleSideMenuLinks.length > 0 && (
            <div className="px-3 pt-3 pb-2">
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.quickLinks}</p>
              {visibleSideMenuLinks.map((link, index) => (
                <Link
                  key={`${link.label}-${index}`}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Pages section */}
          {menuPages.length > 0 && (
            <div className="border-t border-slate-100 px-3 pt-3 pb-2">
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.pages}</p>
              {menuPages.map((page) => (
                <Link
                  key={page._id}
                  href={`/pages/${page.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 hover:text-sky-900 active:bg-sky-100"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                  {page.menuLabel || page.title}
                </Link>
              ))}
            </div>
          )}

          {/* Categories section */}
          {isCategoryMenuVisible && (
            <div className="border-t border-slate-100 px-3 pt-3 pb-4">
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((label, index) => (
                  <Link
                    key={`${label}-${index}`}
                    href={`/category/${encodeURIComponent(label)}`}
                    onClick={onClose}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-300 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
