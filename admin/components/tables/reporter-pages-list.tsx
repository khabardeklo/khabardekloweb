"use client";

type PageRow = {
  id: string;
  title: string;
  templateType: string;
  status: string;
};

type ReporterPagesListProps = {
  pages: PageRow[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export function ReporterPagesList({ pages, isLoading = false, onDelete, onEdit }: ReporterPagesListProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-950">Your pages</h2>
        <p className="mt-1 text-sm text-slate-600">Pages you have created</p>
      </div>
      <div className="divide-y divide-slate-200">
        {isLoading ? (
          <div className="px-6 py-10 text-sm text-slate-500">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">No pages created yet. Create one to get started.</div>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="grid gap-3 p-6 md:grid-cols-[1.5fr_0.7fr_0.5fr_0.8fr] md:items-center">
              <div>
                <h3 className="font-semibold text-slate-950">{page.title}</h3>
              </div>
              <span className="text-sm text-slate-600">{page.templateType}</span>
              <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {page.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit?.(page.id)}
                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(page.id)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
