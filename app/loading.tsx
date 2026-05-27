import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600 mx-auto" />
        </div>
        <p className="text-sm text-slate-600">로딩 중...</p>
      </div>
    </div>
  );
}
