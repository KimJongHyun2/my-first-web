import React from "react";

export default function PostsLoading() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="apple-card p-5 animate-pulse">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-14 w-full rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
