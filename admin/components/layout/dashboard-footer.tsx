import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

type DashboardFooterProps = {
  footerText?: string;
  navItems?: NavItem[];
};

export function DashboardFooter({ footerText, navItems = [] }: DashboardFooterProps) {
  const quickLinks = navItems.slice(0, 3);

  return (
    <footer className="border-t border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left sm:text-sm lg:px-8">
        <p className="font-medium text-slate-600">{footerText || "Khabar Deklo Admin Dashboard"}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          {quickLinks.length > 0
            ? quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-sky-700">
                  {item.label}
                </Link>
              ))
            : (
              <>
                <Link href="/dashboard" className="hover:text-sky-700">Dashboard</Link>
                <Link href="/news" className="hover:text-sky-700">News</Link>
                <Link href="/users" className="hover:text-sky-700">Users</Link>
              </>
            )}
        </div>
      </div>
    </footer>
  );
}
