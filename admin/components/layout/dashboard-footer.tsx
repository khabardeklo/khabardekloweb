import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="border-t border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left sm:text-sm lg:px-8">
        <p className="font-medium text-slate-600">Khabar Deklo Admin Dashboard</p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          <Link href="/dashboard" className="hover:text-sky-700">
            Dashboard
          </Link>
          <Link href="/news" className="hover:text-sky-700">
            News
          </Link>
          <Link href="/users" className="hover:text-sky-700">
            Users
          </Link>
        </div>
      </div>
    </footer>
  );
}
