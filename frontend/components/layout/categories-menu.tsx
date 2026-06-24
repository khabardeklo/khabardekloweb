'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useLang } from '@/lib/language-context';

const categories = [
  'धर्म',
  'खेल',
  'लाइफस्टाइल',
  'वेब स्टोरी',
  'वीडियो',
  'बिजनेस',
  'AI',
  'इन्फॉर्मेशन',
  'विश्व',
  'जुर्म',
  'टेक्नोलॉजी',
  'पिछले चुनाव',
  'सैर-सपाटा',
  'एजुकेशन',
  'डिफेंस न्यूज',
  'कला-संस्कृति',
  'Explained',
  'कार्यक्रम',
  'साइंस न्यूज़',
  'फुल कवरेज',
  'इन्टरैक्टिव',
  'ऑटो',
  'ट्रेंडिंग',
  'फैक्ट चेक',
  'क्विज़',
  'हेल्थ',
  'कृषि समाचार',
  'लीगल न्यूज़',
  'फोटो',
  'आपका पेज',
  'पेट्रोल-डीजल',
  'मौसम',
  'साहित्य',
  'एंकर्स',
  'अर्काइव',
  'गेम्स',
  'रेट कार्ड',
  'निवेशक (Investor)',
];

type CategoriesMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuPages: Array<{
    _id: string;
    title: string;
    slug: string;
    menuLabel?: string;
  }>;
  sideMenuLinks: Array<{
    label: string;
    href: string;
    isActive: boolean;
  }>;
  isCategoryMenuVisible: boolean;
  maxSideMenuLinks: number;
};

export function CategoriesMenu({ isOpen, onClose, menuPages, sideMenuLinks, isCategoryMenuVisible, maxSideMenuLinks }: CategoriesMenuProps) {
  const { t } = useLang();
  const visibleSideMenuLinks = sideMenuLinks
    .filter((link) => link.isActive !== false)
    .slice(0, Math.max(1, maxSideMenuLinks || 16));

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
<>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          role="presentation"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[280px] sm:w-[300px] max-w-[85vw] bg-white shadow-xl transition-transform duration-300 overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 sm:px-4 py-3 bg-white sticky top-0 z-50">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-700">{t.menu}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="rounded-lg p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all min-h-10 min-w-10 flex items-center justify-center flex-shrink-0"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="h-[calc(100vh-73px)] overflow-y-auto px-2 py-2">
          {visibleSideMenuLinks.length > 0 ? (
            <div className="mb-4 border-b border-slate-200 pb-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.quickLinks}</p>
              {visibleSideMenuLinks.map((link, index) => (
                <Link
                  key={`${link.label}-${index}`}
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2.5 text-sm sm:text-base font-semibold text-slate-900 transition-colors hover:bg-slate-100 min-h-10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}

          {menuPages.length > 0 ? (
            <div className="mb-4">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.pages}</p>
              {menuPages.map((page) => (
                <Link
                  key={page._id}
                  href={`/pages/${page.slug}`}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2.5 text-sm sm:text-base font-semibold text-sky-800 transition-colors hover:bg-sky-50 min-h-10"
                >
                  {page.menuLabel || page.title}
                </Link>
              ))}
            </div>
          ) : null}

          {isCategoryMenuVisible
            ? categories.map((label, index) => (
                <Link
                  key={`${label}-${index}`}
                  href={`/category/${encodeURIComponent(label)}`}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2.5 text-sm sm:text-base font-medium text-slate-800 transition-colors hover:bg-slate-100 min-h-10"
                >
                  {label}
                </Link>
              ))
            : null}
        </nav>
      </aside>
    </>
  );
}
