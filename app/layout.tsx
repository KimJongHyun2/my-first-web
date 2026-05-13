import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navigation />
          <main className="max-w-4xl mx-auto p-6 w-full flex-1">{children}</main>
          <footer className="py-4 text-center text-gray-500">© 2026 내 블로그</footer>
        </AuthProvider>
      </body>
    </html>
  );
}
