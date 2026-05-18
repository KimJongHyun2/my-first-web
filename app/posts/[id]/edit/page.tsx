"use client";

import Link from "next/link";
import { useRouter, useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [post, setPost] = useState<PostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchPost = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("posts")
          .select("id, title, content, created_at, user_id")
          .eq("id", id)
          .maybeSingle<PostRow>();

        if (fetchError || !data) {
          notFound();
        }

        // 현재 로그인 사용자가 작성자인지 확인 (UI 레벨)
        // 실제 보안은 Ch11의 RLS(Row Level Security)에서 처리
        if (user?.id !== data.user_id) {
          notFound();
        }

        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError("게시글을 불러올 수 없습니다.");
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, authLoading, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    if (!title.trim()) {
      setSubmitError("제목을 입력하세요.");
      setIsSubmitting(false);
      return;
    }

    if (!content.trim()) {
      setSubmitError("내용을 입력하세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title: title.trim(),
          content: content.trim(),
        })
        .eq("id", id);

      if (updateError) {
        setSubmitError("게시글 수정에 실패했습니다.");
        console.error("Failed to update post:", updateError);
        return;
      }

      // 성공 후 상세 페이지로 이동
      router.push(`/posts/${id}`);
    } catch (err) {
      setSubmitError("게시글 수정 중 오류가 발생했습니다.");
      console.error("Update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <section className="apple-card mx-auto max-w-3xl p-6 sm:p-8 lg:p-10">
        <p className="text-sm text-slate-600">인증 확인 중...</p>
      </section>
    );
  }

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

  return (
    <section className="apple-card mx-auto max-w-3xl space-y-8 p-6 sm:p-8 lg:p-10">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Edit Post</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">글 수정하기</h1>
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-600">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full rounded-full border border-gray-300 bg-white/85 px-4 outline-none shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-slate-600">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-56 w-full rounded-[1.75rem] border border-gray-300 bg-white/85 px-4 py-3 outline-none shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            placeholder="내용을 입력하세요"
            required
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isSubmitting ? "수정중..." : "수정 저장"}
          </button>
          <Link
            href={`/posts/${id}`}
            className="rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            취소
          </Link>
        </div>
      </form>
    </section>
  );
}
