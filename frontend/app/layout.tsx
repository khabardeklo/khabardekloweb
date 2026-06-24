import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLayoutPagesData } from "@/lib/pages-api";
import { getPublicSiteSettings } from "@/lib/site-settings-api";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

export const dynamic = "force-dynamic";

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getPublicSiteSettings();

  return {
    title: settings.siteName,
    description: settings.siteDescription,
    viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  };
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [{ headerPages, footerPages, menuPages, customPages }, siteSettings] = await Promise.all([
    getLayoutPagesData(),
    getPublicSiteSettings(),
  ]);

  return (
    <html lang="hi">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <LanguageProvider>
          {siteSettings.layout.showHeader ? (
            <Header headerPages={headerPages} menuPages={menuPages} siteSettings={siteSettings} />
          ) : null}
          {children}
          {siteSettings.layout.showFooter ? (
            <Footer footerPages={footerPages} customPages={customPages} siteSettings={siteSettings} />
          ) : null}
        </LanguageProvider>
      </body>
    </html>
  );
}
