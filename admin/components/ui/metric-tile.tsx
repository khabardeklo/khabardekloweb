type MetricTileProps = {
  label: string;
  value: string;
  delta: string;
};

export function MetricTile({ label, value, delta }: MetricTileProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="text-3xl font-black text-slate-950">{value}</span>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{delta}</span>
      </div>
    </article>
  );
}