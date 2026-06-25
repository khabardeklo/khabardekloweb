"use client";
import Link from "next/link";
import type { PublicSiteSettings } from "@/lib/site-settings-api";
import { useLang } from "@/lib/language-context";

type FooterPageItem = { _id: string; title: string; slug: string; menuLabel?: string };
type FooterProps = { footerPages: FooterPageItem[]; customPages: FooterPageItem[]; siteSettings: PublicSiteSettings };

const SOCIAL_LINKS = [
  {
    name: "Facebook", href: "#",
    bg: "hover:bg-blue-600",
    icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  },
  {
    name: "X / Twitter", href: "#",
    bg: "hover:bg-slate-700",
    icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
  },
  {
    name: "YouTube", href: "#",
    bg: "hover:bg-red-600",
    icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
  {
    name: "Instagram", href: "#",
    bg: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500",
    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />,
  },
];

const CATEGORIES = [
  { label: "राजनीति", href: "/category/राजनीति" },
  { label: "खेल", href: "/category/खेल" },
  { label: "बिजनेस", href: "/category/बिजनेस" },
  { label: "मनोरंजन", href: "/category/मनोरंजन" },
  { label: "टेक्नोलॉजी", href: "/category/टेक्नोलॉजी" },
  { label: "हेल्थ", href: "/category/हेल्थ" },
  { label: "विश्व", href: "/category/विश्व" },
  { label: "शिक्षा", href: "/category/शिक्षा" },
];

export function Footer({ footerPages, customPages, siteSettings }: FooterProps) {
  const { t } = useLang();
  const maxFooterLinks = Math.max(1, siteSettings.layout.maxFooterLinks || 8);
  const managedLinks = siteSettings.footerLinks.filter((link) => link.isActive !== false);
  const visibleLinks = [...footerPages, ...customPages].slice(0, maxFooterLinks);
  const linksToRender = visibleLinks.length > 0 ? visibleLinks : managedLinks.slice(0, maxFooterLinks);

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top wave accent */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 30%, #ec4899 60%, #f97316 80%, #ef4444 100%)" }} />

      {/* Main Grid */}
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black text-sm">K</div>
              <span className="font-heading text-xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {siteSettings.siteName || "Khabar Deklo"}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {siteSettings.siteDescription || "Your trusted source for the latest news in Hindi and English."}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 transition-all duration-200 ${s.bg} hover:text-white hover:scale-110`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="h-3 w-0.5 rounded-full bg-sky-500" />
              Categories
            </p>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 sm:grid-cols-1 sm:gap-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  >
                    <svg className="h-3 w-3 text-slate-600 transition group-hover:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="h-3 w-0.5 rounded-full bg-violet-500" />
              Quick Links
            </p>
            <ul className="space-y-2">
              {linksToRender.length > 0
                ? linksToRender.map((link) => {
                    const isPage = "slug" in link;
                    const href = isPage ? `/pages/${(link as FooterPageItem).slug}` : (link as { href: string }).href;
                    const label = isPage ? (link as FooterPageItem).menuLabel || (link as FooterPageItem).title : (link as { label: string }).label;
                    return (
                      <li key={href}>
                        <Link href={href} className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
                          <svg className="h-3 w-3 text-slate-600 transition group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                          {label}
                        </Link>
                      </li>
                    );
                  })
                : [
                    { label: "About Us", href: "/pages/about" },
                    { label: "Contact", href: "/pages/contact" },
                    { label: "Privacy Policy", href: "/pages/privacy-policy" },
                    { label: "Terms of Service", href: "/pages/terms" },
                    { label: "Advertise With Us", href: "/pages/advertise" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
                        <svg className="h-3 w-3 text-slate-600 transition group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="h-3 w-0.5 rounded-full bg-emerald-500" />
              {t.newsletter}
            </p>
            <p className="mb-4 text-sm leading-6 text-slate-400">{t.newsletterDesc}</p>
            <form action="/api/newsletter" method="post" className="flex flex-col gap-2.5" aria-label="Newsletter signup">
              <input
                type="email"
                placeholder={t.yourEmail}
                className="rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500 focus:bg-slate-800 focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                type="submit"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-900/30 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t.subscribe}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            {siteSettings.copyrightText || `© ${new Date().getFullYear()} Khabar Deklo. All rights reserved.`}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            {[
              { label: t.privacy, href: "/pages/privacy-policy" },
              { label: t.terms, href: "/pages/terms" },
              { label: t.advertise, href: "/pages/advertise" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-slate-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
