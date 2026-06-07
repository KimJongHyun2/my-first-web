"use client";

import { Search } from "lucide-react";

export type SearchScope = "title-content" | "title" | "content";

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
  scope?: SearchScope;
  onScopeChange?: (value: SearchScope) => void;
  placeholder?: string;
};

const scopeOptions: Array<{ value: SearchScope; label: string }> = [
  { value: "title-content", label: "제목+내용" },
  { value: "title", label: "제목만" },
  { value: "content", label: "내용만" },
];

export default function SearchBar({
  query,
  onChange,
  scope = "title-content",
  onScopeChange,
  placeholder = "제목 또는 내용으로 검색해보세요",
}: SearchBarProps) {
  return (
    <div className="apple-card p-4 sm:p-5">
      <label htmlFor="post-search" className="block text-sm font-medium text-slate-600">
        빠른 검색
      </label>
      <div className="mt-3 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="post-search"
            type="text"
            value={query}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-12 w-full rounded-full border border-white/80 bg-white/90 pl-11 pr-4 text-sm shadow-[0_8px_30px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <select
          value={scope}
          onChange={(event) => onScopeChange?.(event.target.value as SearchScope)}
          className="h-12 rounded-full border border-white/80 bg-white/90 px-4 text-sm font-medium text-slate-600 shadow-[0_8px_30px_rgba(15,23,42,0.05)] outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
          aria-label="검색 범위"
        >
          {scopeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
