import { AdminShell } from "@/components/layout/admin-shell";
import { ReporterManagementPanel } from "@/components/reporter-management/reporter-management-panel";

export default function ReporterManagementPage() {
  return (
    <AdminShell title="Reporter Management" subtitle="Approve reporter applications before login access is enabled.">
      <ReporterManagementPanel />
    </AdminShell>
  );
}