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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0284c7" />
        <link rel="apple-touch-icon" href="/logo english.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Khabar Deklo" />
      </head>
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
