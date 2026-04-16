import type { UserRow } from "@/types";

type UsersTableProps = {
  rows: UserRow[];
};

export function UsersTable({ rows }: UsersTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-950">Users</h2>
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((row) => (
          <div key={row.email} className="grid gap-3 p-6 md:grid-cols-[1fr_1fr_0.6fr] md:items-center">
            <div>
              <h3 className="font-semibold text-slate-950">{row.name}</h3>
              <p className="text-sm text-slate-500">{row.email}</p>
            </div>
            <span className="text-sm text-slate-600">{row.role}</span>
            <span className="inline-flex w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{row.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}