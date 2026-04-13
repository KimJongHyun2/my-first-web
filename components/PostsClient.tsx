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
    <div className="space-y-4">
      <SearchBar query={query} onChange={setQuery} />

      {filteredPosts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href={`/posts/${post.id}`} className="block">
                <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>
                <p className="mt-3 text-sm text-gray-500">
                  {post.author} · {post.date}
                </p>
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                className="mt-4 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
