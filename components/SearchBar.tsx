"use client";

import { Search } from "lucide-react";

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="apple-card p-4 sm:p-5">
      <label htmlFor="post-search" className="block text-sm font-medium text-slate-600">
        빠른 검색
      </label>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="post-search"
          type="text"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          placeholder="제목을 입력해보세요"
          className="h-12 w-full rounded-full border border-white/80 bg-white/90 pl-11 pr-4 text-sm shadow-[0_8px_30px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
        />
      </div>
    </div>
  );
}
