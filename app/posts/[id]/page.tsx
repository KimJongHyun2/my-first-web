import Link from "next/link";
import { posts } from "@/lib/posts";

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);
  const post = posts.find((item) => item.id === postId);

  if (!post) {
    return (
      <section className="apple-card space-y-4 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Note</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">게시글 상세</h1>
        <p className="text-slate-600">아직 내용을 불러오지 못했어요.</p>
        <Link
          href="/posts"
          className="inline-flex rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          목록으로
        </Link>
      </section>
    );
  }

  return (
    <article className="apple-card space-y-8 p-8 sm:p-10">
      <header className="space-y-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium tracking-[0.18em] text-slate-500">
          NOTE
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance text-slate-950 sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-sm text-slate-500">
          {post.author} · {post.date}
        </p>
      </header>

      <p className="max-w-3xl text-base leading-8 text-slate-600">{post.content}</p>

      <Link
        href="/posts"
        className="inline-flex rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        목록으로
      </Link>
    </article>
  );
}
