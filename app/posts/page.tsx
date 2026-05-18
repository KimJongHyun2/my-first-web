"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

const supabase = createClient();

export default function PostsPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      const { data, error: queryError } = await supabase
        .from("posts")
        .select("id, title, content, created_at, user_id")
        .order("created_at", { ascending: false });

      if (queryError) {
        console.error("Failed to load posts:", queryError);
        setError("게시글을 불러오지 못했습니다.");
        setPosts([]);
      } else {
        setPosts(data ?? []);
        setError(null);
      }

      setLoading(false);
    };

    loadPosts();
  }, []);

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
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                    Post
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-slate-700">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.content}</p>
                <p className="mt-4 text-xs text-slate-500">작성자 ID: {post.user_id}</p>
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
