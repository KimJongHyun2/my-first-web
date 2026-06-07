"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const MAX_IMAGE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/posts/new");
    }
  }, [loading, router, user]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setImageError(null);

    if (!file) {
      setImageUrl(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageUrl(null);
      setImageError("jpg, jpeg, png 파일만 첨부할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageUrl(null);
      setImageError("이미지는 2MB 이하만 첨부할 수 있습니다.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.onerror = () => {
      setImageUrl(null);
      setImageError("이미지를 미리보기로 불러오지 못했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    setImageError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      router.replace("/login?redirect=/posts/new");
      return;
    }

    // 클라이언트 유효성 검사 (UX 레벨)
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    let hasError = false;

    if (trimmedTitle.length < 2) {
      setTitleError("제목은 최소 2자 이상 입력해주세요.");
      hasError = true;
    } else {
      setTitleError(null);
    }

    if (trimmedContent.length < 10) {
      setContentError("내용을 10자 이상 입력해주세요.");
      hasError = true;
    } else {
      setContentError(null);
    }

    if (hasError) {
      setErrorMessage("입력값을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create post:", error);
      setErrorMessage("게시글을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setIsSubmitting(false);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage("성공적으로 업로드 되었습니다.");
    redirectTimerRef.current = setTimeout(() => {
      router.push(`/posts/${data.id}`);
    }, 1200);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <section className="apple-card mx-auto max-w-3xl p-6 sm:p-8 lg:p-10">
        <p className="text-sm text-slate-600">불러오는 중...</p>
      </section>
    );
  }

  return (
    <section className="apple-card mx-auto max-w-3xl space-y-8 p-6 sm:p-8 lg:p-10">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">New draft</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">새 글 쓰기</h1>
        <p className="text-base leading-7 text-slate-600">메모를 남기듯 가볍게 적고, 필요할 때 다시 꺼내볼 수 있게 해보세요.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-600">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (event.target.value.trim()) {
                setTitleError(null);
              }
            }}
            className={`h-12 w-full rounded-full border bg-white/85 px-4 outline-none shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
              titleError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="제목을 입력하세요"
            required
          />
          {titleError ? <p className="text-sm text-red-600">{titleError}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-slate-600">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              if (event.target.value.trim()) {
                setContentError(null);
              }
            }}
            className="min-h-56 w-full rounded-[1.75rem] border border-gray-300 bg-white/85 px-4 py-3 outline-none shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            placeholder="내용을 입력하세요"
            required
          />
          {contentError ? <p className="text-sm text-red-600">{contentError}</p> : null}
        </div>

        <div className="space-y-3">
          <label htmlFor="image" className="block text-sm font-medium text-slate-600">
            이미지 첨부
          </label>
          <label
            htmlFor="image"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <ImageIcon className="h-4 w-4" />
            jpg, jpeg, png 파일 선택
          </label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="sr-only"
          />
          {imageError ? <p className="text-sm text-red-600">{imageError}</p> : null}
          {imageUrl ? (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/85 shadow-sm">
              <img src={imageUrl} alt="선택한 이미지 미리보기" className="max-h-80 w-full object-cover" />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-lg shadow-slate-900/10 transition hover:bg-white hover:text-slate-950"
                aria-label="이미지 제거"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
            {successMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-full px-5 py-3 text-sm font-medium shadow-lg transition ${
              isSubmitting
                ? "bg-slate-400 text-white cursor-not-allowed shadow-none"
                : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800"
            }`}
          >
            {isSubmitting ? "업로드 중..." : "글 업로드"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/posts")}
            className="rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            돌아가기
          </button>
        </div>
      </form>
    </section>
  );
}
