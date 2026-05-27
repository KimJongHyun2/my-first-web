import React from "react";

export default function PostDetailLoading() {
  return (
    <article className="apple-card mx-auto max-w-3xl p-6 sm:p-8 lg:p-10">
      <div className="h-6 w-32 rounded bg-slate-200 animate-pulse" />
      <div className="mt-6 h-10 w-3/4 rounded bg-slate-200 animate-pulse" />
      <div className="mt-4 h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
      <div className="mt-6 space-y-4">
        <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
      </div>
    </article>
  );
}
