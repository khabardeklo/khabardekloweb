import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLayoutPagesData } from "@/lib/pages-api";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khabar Deklo",
  description: "Daily news, analysis, and breaking stories from Khabar Deklo.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { headerPages, footerPages, menuPages, customPages } = await getLayoutPagesData();

  return (
    <html lang="en">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_40%),linear-gradient(180deg,#f8fafc_0%,#ffffff_55%,#eff6ff_100%)] text-slate-950">
        <Header headerPages={headerPages} menuPages={menuPages} />
        {children}
        <Footer footerPages={footerPages} customPages={customPages} />
      </body>
    </html>
  );
}
