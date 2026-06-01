"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
  
type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [post, setPost] = useState<PostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .eq("id", id)
          .maybeSingle<PostRow>();

        if (fetchError || !data) {
          console.error('Failed to fetch post:', fetchError);
          setError('게시글을 찾을 수 없습니다.');
          setPost(null);
          return;
        }

        setPost(data);
      } catch (err) {
        setError("게시글을 불러올 수 없습니다.");
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, supabase]);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const handleDelete = async () => {
    if (!post || !user || user.id !== post.user_id) {
      setDeleteError("삭제 권한이 없습니다.");
      return;
    }

    // 사용자 확인 (삭제 전)
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const { error: deleteErr } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (deleteErr) {
        setDeleteError("게시글 삭제에 실패했습니다.");
        console.error("Failed to delete post:", deleteErr);
        return;
      }

      router.push("/posts");
    } catch (err) {
      setDeleteError("게시글 삭제 중 오류가 발생했습니다.");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="apple-card mx-auto max-w-3xl p-6 sm:p-8 lg:p-10">
        <p className="text-sm text-slate-600">불러오는 중...</p>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="apple-card mx-auto max-w-3xl p-6 sm:p-8 lg:p-10">
        <p className="text-sm text-red-600">{error || "게시글을 찾을 수 없습니다."}</p>
      </section>
    );
  }

  // 현재 로그인 사용자가 작성자인지 확인 (UI 레벨)
  // 실제 보안은 Ch11의 RLS(Row Level Security)에서 처리
  const isAuthor = user?.id === post.user_id;

  return (
    <article className="apple-card space-y-8 p-8 sm:p-10 relative">
      <header className="space-y-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium tracking-[0.18em] text-slate-500">
          POST
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance text-slate-950 sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-sm text-slate-500">
          {formatDate(post.created_at)} · 작성자: (비공개)
        </p>
      </header>

      <p className="max-w-3xl text-base leading-8 text-slate-600">{post.content}</p>

      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      {isAuthor ? (
        <div ref={menuRef} className="absolute top-8 right-8">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
              <Link
                href={`/posts/${post.id}/edit`}
                className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-t-lg"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleDelete();
                }}
                disabled={isDeleting}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition"
              >
                {isDeleting ? "삭제중..." : "삭제"}
              </button>
            </div>
          )}
        </div>
      ) : null}

      <Link
        href="/posts"
        className="inline-flex rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        목록으로
      </Link>
    </article>
  );
}
