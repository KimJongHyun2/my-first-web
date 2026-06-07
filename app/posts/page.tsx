"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  like_count: number;
  image_url?: string | null;
};

const supabase = createClient();

const normalizePost = (
  post: Omit<PostRow, "like_count"> & { like_count?: number | null; image_url?: string | null },
): PostRow => ({
  ...post,
  like_count: post.like_count ?? 0,
  image_url: post.image_url ?? null,
});

export default function PostsPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      const initialResult = await supabase
        .from("posts")
        .select("id, title, content, created_at, user_id, like_count, image_url")
        .order("created_at", { ascending: false });
      let data: PostRow[] | null = initialResult.data?.map(normalizePost) ?? null;
      let queryError = initialResult.error;

      if (queryError) {
        const fallbackResult = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .order("created_at", { ascending: false });

        data = fallbackResult.data?.map(normalizePost) ?? null;
        queryError = fallbackResult.error;
      }

      if (queryError) {
        console.error("Failed to load posts:", queryError);
        setError("게시글을 불러오지 못했습니다.");
        setPosts([]);
      } else {
        setPosts((data ?? []).map(normalizePost));
        setError(null);
      }

      setLoading(false);
    };

    loadPosts();
  }, []);

  const handleLike = async (postId: string) => {
    setLikingPostId(postId);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        console.warn("Failed to like post:", result.error ?? response.statusText);
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, like_count: result.likeCount } : post,
        ),
      );
    } catch (likeError) {
      console.error("Failed to like post:", likeError);
    } finally {
      setLikingPostId(null);
    }
  };

  return (
    <section className="space-y-8">
      <div className="apple-card p-8 sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Posts</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          게시글 목록
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          최근에 적은 기록들을 한눈에 살펴보세요.
        </p>
      </div>

      {loading ? <p className="apple-card p-6 text-sm text-slate-600">불러오는 중...</p> : null}

      {!loading && error ? <p className="apple-card p-6 text-sm text-red-600">{error}</p> : null}

      {!loading && !error && posts.length === 0 ? (
        <p className="apple-card border-dashed p-6 text-sm text-slate-600">아직 게시글이 없어요.</p>
      ) : null}

      {!loading && !error && posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group apple-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
            >
              <Link href={`/posts/${post.id}`} className="block">
                {post.image_url ? (
                  <div className="mb-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
                    <img src={post.image_url} alt="" className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                    Post
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(post.created_at)}</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-slate-700">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.content}</p>
                <p className="mt-4 text-xs text-slate-500">작성자: (비공개)</p>
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={likingPostId === post.id}
                onClick={() => handleLike(post.id)}
                className="mt-5 border-slate-200 bg-white/85 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              >
                👍 좋아요 {post.like_count}
              </Button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
