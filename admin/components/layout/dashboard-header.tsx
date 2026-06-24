"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/layout/logout-button";

type NavItem = {
  label: string;
  href: string;
};

type DashboardHeaderProps = {
  title: string;
  navItems: NavItem[];
  accentColor?: string;
};

export function DashboardHeader({ title, navItems, accentColor }: DashboardHeaderProps) {
  void accentColor;
  const headerLinks = navItems.slice(0, 4);

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-full px-3 sm:px-4 py-3 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/dashboard" className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 min-h-10 min-w-10">
            <span className="h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full bg-sky-600" />
            <span className="text-xs sm:text-sm font-black tracking-tight text-slate-950 hidden sm:inline">{title}</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:gap-2 lg:flex">
            {headerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-2 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 min-h-9"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout - Visible on all devices */}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
