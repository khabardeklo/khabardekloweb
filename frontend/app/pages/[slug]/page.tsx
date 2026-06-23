import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPageBySlug } from "@/lib/pages-api";

type PublicPageProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (value?: string): string => {
  if (!value) {
    return "Recently updated";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently updated";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:w-[70%] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{page.templateType.replace("-", " ")}</p>
        <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{page.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Updated on {formatDate(page.updatedAt || page.createdAt)}</p>

        <div className="prose prose-slate mt-8 max-w-none overflow-hidden break-words">
          <style suppressHydrationWarning>{`
            .prose {
              overflow-x: hidden;
            }
            .prose img,
            .prose video,
            .prose iframe {
              max-width: 100%;
              height: auto;
            }
            .prose table,
            .prose pre {
              display: block;
              max-width: 100%;
              overflow-x: auto;
            }
            .prose p,
            .prose li,
            .prose h1,
            .prose h2,
            .prose h3,
            .prose h4,
            .prose h5,
            .prose h6,
            .prose a,
            .prose code {
              overflow-wrap: anywhere;
              word-break: break-word;
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700"
        >
          Back to home
        </Link>
      </article>
    </main>
  );
}
