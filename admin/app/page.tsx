import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_right,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#f0fdf4_100%)] text-slate-950">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700 sm:text-sm">Khabar Deklo Admin</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-6xl">
              Simple, colorful, and role-based.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7 sm:text-lg">
              Choose your login path and go straight to work.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-2">
            <Link
              href="/login/super-admin"
              className="group rounded-[1.5rem] border border-blue-200 bg-gradient-to-br from-blue-500 to-cyan-400 p-5 text-white shadow-lg transition hover:-translate-y-1 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">Main Admin</span>
                <span className="text-xl sm:text-2xl">✦</span>
              </div>
              <h2 className="mt-4 text-xl font-black sm:mt-5 sm:text-2xl">Login as Super Admin</h2>
              <p className="mt-2 text-sm leading-6 text-white/90">Full access: layout, users, posts, settings, reporter info.</p>
            </Link>

            <Link
              href="/login/reporter"
              className="group rounded-[1.5rem] border border-emerald-200 bg-gradient-to-br from-emerald-400 to-lime-300 p-5 text-slate-950 shadow-lg transition hover:-translate-y-1 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">Editorial</span>
                <span className="text-xl sm:text-2xl">●</span>
              </div>
              <h2 className="mt-4 text-xl font-black sm:mt-5 sm:text-2xl">Login as Reporter</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">Create, edit, and delete posts/articles only.</p>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
