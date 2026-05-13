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

  return (
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

          {loading ? (
            <div className="rounded px-3 py-1 text-gray-300">로딩 중...</div>
          ) : user ? (
            <>
              <Link
                href="/posts/new"
                className="rounded bg-white/10 px-3 py-1 transition hover:bg-white/20"
              >
                새 글 쓰기
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="rounded px-3 py-1 text-white hover:bg-gray-700"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded px-3 py-1 transition hover:bg-gray-700"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded bg-white/10 px-3 py-1 transition hover:bg-white/20"
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
