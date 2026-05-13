'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpWithEmail } from '@/lib/auth';

export default function SignupForm({ redirectTarget }: { redirectTarget: string }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const isConnectionError = error.includes('Supabase 서버에 연결할 수 없습니다');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error: authError } = await signUpWithEmail(email, password, name);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    setSuccess('가입 완료. 로그인하세요.');
    setName('');
    setEmail('');
    setPassword('');

    setTimeout(() => {
      router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>새 계정을 만들어보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                이름
              </label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="space-y-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
                <div>{error}</div>
                {isConnectionError && (
                  <div className="text-xs text-red-700">
                    확인 순서: 1) Supabase 대시보드에서 Email Provider 활성화 2) URL Configuration 확인 3) 브라우저에서 Supabase health URL 접근 가능 여부 확인
                  </div>
                )}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !!success}>
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            이미 계정이 있으신가요?{' '}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
              className="text-primary hover:underline"
            >
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}