'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpWithEmail } from '@/lib/auth';
import toUserFriendlyMessage from '@/lib/error-message';

export default function SignupForm({ redirectTarget }: { redirectTarget: string }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const isConnectionError = error.includes('Supabase 서버에 연결할 수 없습니다');
  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    const { error: authError } = await signUpWithEmail(email, password, name);

    if (authError) {
      console.error('Signup error:', authError);
      setError(toUserFriendlyMessage(authError));
      setLoading(false);
      return;
    }

    setSuccess('가입 완료. 로그인하세요.');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
    }, 2000);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-2xl items-center">
      <Card className="relative w-full p-0 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-400 to-slate-200" />
        <CardHeader className="pt-8">
          <CardTitle className="text-2xl font-semibold text-slate-950">회원가입</CardTitle>
          <CardDescription className="text-slate-600">기록을 남길 준비를 해보세요.</CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-600">
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

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-600">
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

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-600">
                비밀번호
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600">
                비밀번호 확인
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className={`pr-10 ${passwordMismatch ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="text-sm text-red-600">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            {error && (
              <div className="space-y-2 rounded-[1.5rem] border border-red-200 bg-red-50/80 p-4 text-sm text-red-800">
                <div>{error}</div>
                {isConnectionError && (
                  <div className="text-xs text-red-700">
                    확인 순서: 1) Supabase 대시보드에서 Email Provider 활성화 2) URL Configuration 확인 3) 브라우저에서 Supabase health URL 접근 가능 여부 확인
                  </div>
                )}
              </div>
            )}

            {success && (
              <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800" disabled={loading || !!success}>
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            이미 시작하셨나요?{' '}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}