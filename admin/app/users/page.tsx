import { AdminShell } from "@/components/layout/admin-shell";
import { UsersTable } from "@/components/tables/users-table";
import { sampleUsers } from "@/lib/constants";

export default function UsersPage() {
  return (
    <AdminShell title="Users" subtitle="Manage authors, editors, and administrators.">
      <UsersTable rows={sampleUsers} />
    </AdminShell>
  );
}