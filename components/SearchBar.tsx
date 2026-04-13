"use client";

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <label htmlFor="post-search" className="block text-sm font-medium text-gray-700">
        게시글 검색
      </label>
      <input
        id="post-search"
        type="text"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="제목으로 검색해보세요"
        className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-gray-500"
      />
    </div>
  );
}
