import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ReporterApplicationForm } from "@/components/reporter-application/reporter-application-form";

export default function ReporterApplyPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_32%),radial-gradient(circle_at_right,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,#ecfeff_0%,#ffffff_50%,#f8fafc_100%)]">
      <SiteHeader />
      <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ReporterApplicationForm />
      </main>
      <SiteFooter />
    </div>
  );
}