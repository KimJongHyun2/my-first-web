"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("저장되었습니다");
    router.push("/posts");
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">새 글 쓰기</h1>
        <p className="text-sm text-gray-600">제목과 내용을 입력하고 저장해 보세요.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-gray-500"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-40 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-gray-500"
            placeholder="내용을 입력하세요"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            저장하기
          </button>
          <button
            type="button"
            onClick={() => router.push("/posts")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            목록으로
          </button>
        </div>
      </form>
    </section>
  );
}
