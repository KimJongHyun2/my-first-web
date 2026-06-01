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

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
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
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSubmitError, setCommentSubmitError] = useState<string | null>(null);
  const [commentDeletingId, setCommentDeletingId] = useState<string | null>(null);
  const [commentDeleteError, setCommentDeleteError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);

      const { data, error: commentsFetchError } = await supabase
        .from("post_comments")
        .select("id, post_id, user_id, author_name, content, created_at")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (commentsFetchError) {
        console.error("Failed to load comments:", commentsFetchError);
        setCommentsError("댓글을 불러오지 못했습니다.");
        setComments([]);
      } else {
        setComments(data ?? []);
        setCommentsError(null);
      }

      setCommentsLoading(false);
    };

    fetchComments();
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

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!post || !user) {
      setCommentSubmitError("댓글을 작성하려면 로그인해야 합니다.");
      return;
    }

    const trimmedContent = commentContent.trim();

    if (!trimmedContent) {
      setCommentSubmitError("댓글 내용을 입력하세요.");
      return;
    }

    setCommentSubmitting(true);
    setCommentSubmitError(null);

    const authorName = user.user_metadata?.name || user.email || "익명";

    const { data, error: insertError } = await supabase
      .from("post_comments")
      .insert({
        post_id: post.id,
        user_id: user.id,
        author_name: authorName,
        content: trimmedContent,
      })
      .select("id, post_id, user_id, author_name, content, created_at")
      .single();

    if (insertError || !data) {
      console.error("Failed to add comment:", insertError);
      setCommentSubmitError("댓글을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setCommentSubmitting(false);
      return;
    }

    setComments((currentComments) => [...currentComments, data]);
    setCommentContent("");
    setCommentSubmitting(false);
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!user) {
      setCommentDeleteError("댓글을 삭제하려면 로그인해야 합니다.");
      return;
    }

    if (!confirm("이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    setCommentDeletingId(commentId);
    setCommentDeleteError(null);

    const { error: deleteError } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Failed to delete comment:", deleteError);
      setCommentDeleteError("댓글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setCommentDeletingId(null);
      return;
    }

    setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
    setCommentDeletingId(null);
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

      <section className="space-y-5 rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">댓글</h2>
          <p className="text-sm text-slate-500">게시글에 대한 짧은 의견이나 메모를 남겨보세요.</p>
        </div>

        {commentsLoading ? (
          <p className="text-sm text-slate-600">댓글 불러오는 중...</p>
        ) : commentsError ? (
          <p className="text-sm text-red-600">{commentsError}</p>
        ) : comments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500">
            아직 댓글이 없어요. 첫 댓글을 남겨보세요.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{comment.author_name}</p>
                    <p className="text-xs text-slate-400">{formatDate(comment.created_at)}</p>
                  </div>
                  {user?.id === comment.user_id ? (
                    <button
                      type="button"
                      onClick={() => handleCommentDelete(comment.id)}
                      disabled={commentDeletingId === comment.id}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {commentDeletingId === comment.id ? "삭제 중..." : "삭제"}
                    </button>
                  ) : null}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{comment.content}</p>
              </article>
            ))}
          </div>
        )}

        {commentDeleteError ? <p className="text-sm text-red-600">{commentDeleteError}</p> : null}

        {user ? (
          <form className="space-y-3 border-t border-slate-200 pt-5" onSubmit={handleCommentSubmit}>
            <div className="space-y-2">
              <label htmlFor="comment" className="block text-sm font-medium text-slate-600">
                댓글 작성
              </label>
              <textarea
                id="comment"
                value={commentContent}
                onChange={(event) => setCommentContent(event.target.value)}
                className="min-h-28 w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                placeholder="댓글을 입력하세요"
              />
            </div>

            {commentSubmitError ? <p className="text-sm text-red-600">{commentSubmitError}</p> : null}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentSubmitting}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {commentSubmitting ? "등록 중..." : "댓글 등록"}
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-slate-200 pt-5 text-sm text-slate-500">
            댓글을 작성하려면 <Link href="/login" className="font-medium text-slate-900 underline-offset-4 hover:underline">로그인</Link>이 필요합니다.
          </div>
        )}
      </section>

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
