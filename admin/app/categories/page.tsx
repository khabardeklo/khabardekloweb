import { AdminShell } from "@/components/layout/admin-shell";

const categories = ["National", "Politics", "Business", "Technology", "Sports", "Entertainment"];

export default function CategoriesPage() {
  return (
    <AdminShell title="Categories" subtitle="Organize editorial sections and taxonomy.">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
              {category}
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}