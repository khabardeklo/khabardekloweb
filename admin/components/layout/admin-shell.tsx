"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DashboardFooter } from "@/components/layout/dashboard-footer";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Sidebar } from "@/components/layout/sidebar";
import { adminSidebarNav, superAdminNav } from "@/lib/constants";
import { defaultSiteSettings, getPublicSiteSettings, type SiteSettings } from "@/lib/site-settings";

type NavItem = {
  label: string;
  href: string;
};

type SidebarItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

type AdminShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  navItems?: NavItem[];
  sidebarItems?: SidebarItem[];
};

export function AdminShell({ 
  title, 
  subtitle, 
  children, 
  navItems = superAdminNav,
  sidebarItems = adminSidebarNav 
}: AdminShellProps) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    let ignore = false;

    const loadSettings = async () => {
      try {
        const settings = await getPublicSiteSettings();
        if (!ignore) {
          setSiteSettings(settings);
        }
      } catch {
        if (!ignore) {
          setSiteSettings(defaultSiteSettings);
        }
      }
    };

    void loadSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const managedSidebarItems = useMemo(() => {
    return siteSettings.admin.sidebarLinks
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon || "•",
        badge: item.badge,
      }));
  }, [siteSettings.admin.sidebarLinks]);

  const resolvedSidebarItems = managedSidebarItems.length > 0 ? managedSidebarItems : sidebarItems;

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_42%,#f0fdf4_100%)]">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50">
        <DashboardHeader title={siteSettings.admin.headerTitle || title} navItems={navItems} accentColor={siteSettings.theme.accentColor} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 overflow-y-auto">
          <Sidebar items={resolvedSidebarItems} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 w-full flex flex-col overflow-hidden">
          {/* Mobile Sidebar Trigger - Mobile only */}
          <div className="lg:hidden">
            <Sidebar items={resolvedSidebarItems} />
          </div>
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
              </div>
              <section className="space-y-6">{children}</section>
            </div>
          </main>
        </div>
      </div>
      
      {/* Fixed Footer */}
      <div className="sticky bottom-0 z-40">
        <DashboardFooter footerText={siteSettings.admin.footerText} navItems={navItems} />
      </div>
    </div>
  );
}