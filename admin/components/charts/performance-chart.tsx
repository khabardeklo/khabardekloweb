const bars = [72, 54, 88, 64, 92, 78];

export function PerformanceChart() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">Performance trend</h2>
      <div className="mt-6 flex h-56 items-end gap-4">
        {bars.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-full w-full items-end rounded-2xl bg-slate-100 p-2">
              <div className="w-full rounded-xl bg-gradient-to-t from-teal-600 to-sky-400" style={{ height: `${value}%` }} />
            </div>
            <span className="text-xs font-medium text-slate-500">W{index + 1}</span>
          </div>
        ))}
      </div>
    </section>
  );
}