import Link from "next/link";

type FooterPageItem = {
  _id: string;
  title: string;
  slug: string;
  menuLabel?: string;
};

type FooterProps = {
  footerPages: FooterPageItem[];
  customPages: FooterPageItem[];
};

export function Footer({ footerPages, customPages }: FooterProps) {
  const visibleLinks = [...footerPages, ...customPages].slice(0, 8);

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {visibleLinks.length > 0 ? (
          <nav className="mb-4 flex flex-wrap items-center gap-2">
            {visibleLinks.map((page) => (
              <Link
                key={page._id}
                href={`/pages/${page.slug}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              >
                {page.menuLabel || page.title}
              </Link>
            ))}
          </nav>
        ) : null}

        <p className="text-sm text-slate-500">© 2026 Khabar Deklo. All rights reserved.</p>
      </div>
    </footer>
  );
}