import { AdminShell } from "@/components/layout/admin-shell";
import { SiteControlForm } from "@/components/forms/site-control-form";

export default function LayoutPage() {
  return (
    <AdminShell title="Layout" subtitle="Customize your website layout and structure.">
      <SiteControlForm mode="layout" />
    </AdminShell>
  );
}
