import { AdminShell } from "@/components/layout/admin-shell";
import { PerformanceChart } from "@/components/charts/performance-chart";

export default function AnalyticsPage() {
  return (
    <AdminShell title="Analytics" subtitle="Track readership, publishing volume, and engagement.">
      <PerformanceChart />
    </AdminShell>
  );
}