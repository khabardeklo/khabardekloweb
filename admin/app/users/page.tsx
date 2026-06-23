"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { UsersTable } from "@/components/tables/users-table";
import type { UserRow } from "@/types";

type UserApiItem = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  approvalStatus?: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${backendUrl}/users/reporters`, {
          credentials: "include",
        });

        const data = (await response.json().catch(() => null)) as { reporters?: UserApiItem[]; message?: string } | null;

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load users");
        }

        const reporters: UserRow[] = (data?.reporters || []).map((user) => ({
          name: user.name || "Unknown",
          email: user.email || "",
          role: user.role || "reporter",
          status: user.approvalStatus === "active" ? "Active" : user.approvalStatus === "rejected" ? "Rejected" : "Pending",
          approvalStatus: user.approvalStatus,
        }));

        setUsers(reporters);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  return (
    <AdminShell title="Users" subtitle="Manage authors, editors, and administrators.">
      {loading ? <p className="text-sm text-slate-600">Loading users...</p> : null}
      {error ? <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {!loading ? <UsersTable rows={users} /> : null}
    </AdminShell>
  );
}
