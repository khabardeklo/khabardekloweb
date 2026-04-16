import { Button } from "@/components/ui/button";

export function NewsForm() {
  return (
    <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">New article</h2>
      <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Title" />
      <textarea className="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Content" />
      <Button type="submit">Save draft</Button>
    </form>
  );
}