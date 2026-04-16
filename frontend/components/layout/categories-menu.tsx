'use client';

import Link from 'next/link';

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
};

export function CategoriesMenu({ isOpen, onClose, menuPages }: CategoriesMenuProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/45"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[300px] max-w-[85vw] bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="h-[calc(100%-57px)] overflow-y-auto px-2 py-2">
          {menuPages.length > 0 ? (
            <div className="mb-3">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pages</p>
              {menuPages.map((page) => (
                <Link
                  key={page._id}
                  href={`/pages/${page.slug}`}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2 text-[15px] font-semibold text-sky-800 transition-colors hover:bg-sky-50"
                >
                  {page.menuLabel || page.title}
                </Link>
              ))}
            </div>
          ) : null}

          {categories.map((label, index) => (
            <Link
              key={`${label}-${index}`}
              href={`/search?category=${encodeURIComponent(label)}`}
              onClick={onClose}
              className="block rounded-md px-3 py-2 text-[15px] font-medium text-slate-800 transition-colors hover:bg-slate-100"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
