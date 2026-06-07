'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/');
    }
  };

  const displayName = user?.user_metadata?.name || '내';

  return (
    <nav className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="apple-pill mx-auto flex w-full max-w-6xl items-center justify-between border-white/60 px-4 py-3 text-slate-700 shadow-[0_16px_50px_rgba(15,23,42,0.08)] sm:px-5">
        <Link href="/" className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-lg shadow-slate-900/10">
            M
          </span>
          <span>{displayName}님의 블로그</span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:gap-3">
          <Link href="/" className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
            홈
          </Link>
          <Link
            href="/posts"
            className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            게시글
          </Link>

          {loading ? (
            <div className="rounded-full bg-slate-100 px-3 py-2 text-slate-400">로딩 중...</div>
          ) : user ? (
            <>
              <Link
                href="/profile"
                className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
              >
                프로필
              </Link>
              <Link
                href="/posts/new"
                className="rounded-full bg-slate-900 px-4 py-2 text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              >
                새 글 쓰기
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="rounded-full px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-slate-900 px-4 py-2 text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
