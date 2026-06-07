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
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground antialiased">
        <AuthProvider>
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-slate-200/40 blur-3xl dark:bg-blue-950/20" />
            <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-white/70 blur-3xl dark:bg-transparent" />
            <div className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-slate-100/80 blur-3xl dark:bg-transparent" />
          </div>
          <Navigation />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
          <footer className="pb-8 text-center text-sm text-slate-500">
            © 2026 내 블로그
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
