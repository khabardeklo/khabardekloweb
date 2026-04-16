type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = resolvedSearchParams.q ?? "";

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Search</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Search news</h1>
        <form className="mt-6 flex gap-3">
          <input
            defaultValue={query}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
            name="q"
            placeholder="Search news, topics, authors..."
            type="search"
          />
          <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
            Search
          </button>
        </form>
      </section>
    </main>
  );
}