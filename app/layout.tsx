import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 블로그",
  description: "웹 개발을 배우며 기록하는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 text-white">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              내 블로그
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="rounded px-2 py-1 transition hover:bg-gray-700">
                홈
              </Link>
              <Link
                href="/posts"
                className="rounded px-2 py-1 transition hover:bg-gray-700"
              >
                게시글
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6 w-full flex-1">{children}</main>
        <footer className="py-4 text-center text-gray-500">© 2026 내 블로그</footer>
      </body>
    </html>
  );
}
