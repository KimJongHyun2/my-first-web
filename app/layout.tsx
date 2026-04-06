import type { Metadata } from "next";
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
        <nav className="bg-gray-800 p-4 text-white">내 블로그</nav>
        <main className="max-w-4xl mx-auto p-6 w-full flex-1">{children}</main>
        <footer className="py-4 text-center text-gray-500">© 2026 내 블로그</footer>
      </body>
    </html>
  );
}
