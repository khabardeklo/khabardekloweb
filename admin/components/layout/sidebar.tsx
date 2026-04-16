"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SidebarItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

type SidebarProps = {
  items: SidebarItem[];
  onNavigate?: () => void;
};

export function Sidebar({ items, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleNavClick = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-20 z-40 flex lg:hidden bg-white border-b border-slate-200 px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 transition"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="ml-3 text-sm font-semibold text-slate-900">Menu</span>
      </div>

      {/* Sidebar overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:translate-x-0 lg:h-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4 lg:hidden">
          <span className="text-lg font-bold">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-lg hover:bg-slate-700 p-2 transition"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>



        {/* Sidebar Content */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-emerald-400 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-700 px-4 py-4">
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
          >
            <span className="text-lg">👁️</span>
            <span>View Website</span>
          </Link>
        </div>
      </div>
    </>
  );
}
