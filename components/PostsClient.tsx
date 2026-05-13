"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import type { Post } from "@/lib/posts";

type PostsClientProps = {
  initialPosts: Post[];
};

export default function PostsClient({ initialPosts }: PostsClientProps) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) => post.title.toLowerCase().includes(normalizedQuery));
  }, [posts, query]);

  const handleDelete = (postId: number) => {
    const isConfirmed = confirm("정말 이 게시글을 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  };

  return (
    <div className="space-y-5">
      <SearchBar query={query} onChange={setQuery} />

      {filteredPosts.length === 0 ? (
        <p className="apple-card border-dashed p-6 text-sm text-slate-600">
          아직 맞는 글이 없네요. 다른 단어로 한 번 더 찾아보세요.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group apple-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
            >
              <Link href={`/posts/${post.id}`} className="block">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                    Note
                  </span>
                  <span className="text-xs text-slate-400">{post.date}</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-slate-700">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.content}</p>
                <p className="mt-4 text-sm text-slate-500">{post.author}</p>
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                className="mt-5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                삭제
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
