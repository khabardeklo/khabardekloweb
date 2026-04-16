import { AdminShell } from "@/components/layout/admin-shell";
import { PostsList } from "@/components/tables/posts-list";
import { sampleNews } from "@/lib/constants";

export default function PostsPage() {
  return (
    <AdminShell title="Posts" subtitle="Manage all your posts and articles.">
      <PostsList posts={sampleNews} />
    </AdminShell>
  );
}
