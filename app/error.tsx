"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="apple-card max-w-xl p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">문제가 발생했습니다</h2>
        <p className="text-sm text-slate-600 mb-4">잠시 후 다시 시도해주세요.</p>
        <div className="flex justify-center">
          <button
            onClick={() => reset()}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}
