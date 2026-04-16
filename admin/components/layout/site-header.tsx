import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm sm:justify-start">
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
          <span className="text-sm font-black tracking-tight text-slate-950 sm:text-base">Khabar Deklo Admin</span>
        </Link>
        <nav className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
          <Link href="/login/super-admin" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 sm:text-sm">
            Super Admin
          </Link>
          <Link href="/login/reporter" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 sm:text-sm">
            Reporter
          </Link>
        </nav>
      </div>
    </header>
  );
}
