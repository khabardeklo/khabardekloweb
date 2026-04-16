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
};

export function DashboardHeader({ title, navItems }: DashboardHeaderProps) {
  void title;
  void navItems;

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/dashboard" className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm flex-shrink-0">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
            <span className="text-sm font-black tracking-tight text-slate-950 hidden sm:inline">Khabar Deklo Admin</span>
          </Link>

          {/* Logout - Visible on all devices */}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
