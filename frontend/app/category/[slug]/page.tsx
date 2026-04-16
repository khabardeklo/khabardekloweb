import Link from "next/link";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Category</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Stories in {slug}</h1>
        <Link className="mt-6 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-900" href="/">
          Browse all stories
        </Link>
      </div>
    </main>
  );
}