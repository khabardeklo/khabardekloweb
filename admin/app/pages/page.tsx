import { AdminShell } from "@/components/layout/admin-shell";
import { PagesList } from "@/components/tables/pages-list";
import { samplePages, pageCategories } from "@/lib/constants";

export default function PagesPage() {
  return (
    <AdminShell title="Pages" subtitle="Manage all your pages.">
      <PagesList pages={samplePages} categories={pageCategories} />
    </AdminShell>
  );
}
