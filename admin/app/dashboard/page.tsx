"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import Link from "next/link";

type DashboardStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalPages: number;
  totalReporters: number;
  pendingReporters: number;
};

type NewsApiItem = { isPublished?: boolean };
type PageApiItem = { _id?: string };
type ReporterRow = { approvalStatus?: string };

import { backendUrl } from "@/lib/config";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalPages: 0,
    totalReporters: 0,
    pendingReporters: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [newsRes, pagesRes, reportersRes] = await Promise.all([
          fetch(`${backendUrl}/news`, { credentials: "include" }),
          fetch(`${backendUrl}/pages`, { credentials: "include" }),
          fetch(`${backendUrl}/users/reporters`, { credentials: "include" }),
        ]);

        const [newsData, pagesData, reportersData] = await Promise.all([
          newsRes.ok ? (newsRes.json() as Promise<NewsApiItem[]>) : Promise.resolve([]),
          pagesRes.ok ? (pagesRes.json() as Promise<PageApiItem[]>) : Promise.resolve([]),
          reportersRes.ok ? (reportersRes.json() as Promise<{ reporters: ReporterRow[] }>) : Promise.resolve({ reporters: [] }),
        ]);

        const news = Array.isArray(newsData) ? newsData : [];
        const pages = Array.isArray(pagesData) ? pagesData : [];
        const reporters = Array.isArray(reportersData?.reporters) ? reportersData.reporters : [];

        setStats({
          totalPosts: news.length,
          publishedPosts: news.filter((n) => n.isPublished).length,
          draftPosts: news.filter((n) => !n.isPublished).length,
          totalPages: pages.length,
          totalReporters: reporters.length,
          pendingReporters: reporters.filter((r) => r.approvalStatus === "pending").length,
        });
      } catch {
        // silently fail, show zeros
      } finally {
        setLoading(false);
      }
    };

    void loadStats();
  }, []);

  const tiles = [
    { label: "Total Posts", value: stats.totalPosts, href: "/posts", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Published", value: stats.publishedPosts, href: "/posts", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Drafts", value: stats.draftPosts, href: "/posts", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Pages", value: stats.totalPages, href: "/pages", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { label: "Reporters", value: stats.totalReporters, href: "/reporter-management", color: "bg-slate-50 text-slate-700 border-slate-200" },
    { label: "Pending Approval", value: stats.pendingReporters, href: "/reporter-management", color: "bg-rose-50 text-rose-700 border-rose-200" },
  ];

  const quickLinks = [
    { label: "Create Post", href: "/news", icon: "✏️" },
    { label: "Create Page", href: "/create-pages", icon: "📄" },
    { label: "Reporter Management", href: "/reporter-management", icon: "🧾" },
    { label: "Site Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Operations overview for editors, admins, and contributors.">
      {loading ? (
        <p className="text-sm text-slate-600">Loading stats...</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => (
              <Link
                key={tile.label}
                href={tile.href}
                className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 ${tile.color}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{tile.label}</p>
                <p className="mt-3 text-4xl font-black">{tile.value}</p>
              </Link>
            ))}
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
