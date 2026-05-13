"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError(true);
      alert("제목을 입력해주세요.");
      return;
    }

    setTitleError(false);
    alert("저장되었습니다");
    router.push("/posts");
  };

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
                setTitleError(false);
              }
            }}
            className={`h-12 w-full rounded-full border bg-white/85 px-4 outline-none shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
              titleError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="제목을 입력하세요"
            required
          />
          {titleError ? <p className="text-sm text-red-600">제목을 한 줄만 먼저 적어주세요.</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-slate-600">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-56 w-full rounded-[1.75rem] border border-gray-300 bg-white/85 px-4 py-3 outline-none shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            placeholder="내용을 입력하세요"
            required
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
          >
            글 남기기
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
