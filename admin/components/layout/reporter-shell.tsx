import type { ReactNode } from "react";
import { DashboardFooter } from "@/components/layout/dashboard-footer";
import { DashboardHeader } from "@/components/layout/dashboard-header";

type NavItem = {
  label: string;
  href: string;
};

type ReporterShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  navItems?: NavItem[];
};

export function ReporterShell({ 
  title, 
  subtitle, 
  children, 
  navItems = [] 
}: ReporterShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_42%,#f0fdf4_100%)]">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50">
        <DashboardHeader title={title} navItems={navItems} />
      </div>
      
      {/* Scrollable Content Area - No Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content - Full Width */}
        <div className="flex-1 w-full flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <section className="space-y-6">{children}</section>
            </div>
          </main>
        </div>
      </div>
      
      {/* Fixed Footer */}
      <div className="sticky bottom-0 z-40">
        <DashboardFooter />
      </div>
    </div>
  );
}
