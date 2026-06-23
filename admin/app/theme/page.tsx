import { AdminShell } from "@/components/layout/admin-shell";
import { SiteControlForm } from "@/components/forms/site-control-form";

export default function ThemePage() {
  return (
    <AdminShell title="Theme" subtitle="Customize colors, fonts, and visual design.">
      <SiteControlForm mode="theme" />
    </AdminShell>
  );
}
