import Link from "next/link";
import { ArrowRight, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="apple-card overflow-hidden p-8 sm:p-10 lg:p-14">
      <div className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Journal</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl">
          내 블로그
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          기록이 자연스럽게 쌓이고, 읽는 흐름은 더 편안해집니다.
        </p>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button asChild size="lg" className="bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800">
            <Link href="/posts">
              글 둘러보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/70 bg-white/80 text-slate-700 hover:bg-slate-50">
            <Link href="/signup">
              계정 만들기
              <CircleUserRound className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
