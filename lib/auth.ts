'use client';

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    if (error.message === 'Failed to fetch') {
      return 'Supabase 서버에 연결할 수 없습니다. 네트워크, DNS, 프록시, 또는 Supabase 대시보드 설정을 확인하세요.';
    }

    return error.message;
  }

  return fallbackMessage;
}

/**
 * 이메일/비밀번호 로그인
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    const errorMessage = getAuthErrorMessage(err, '로그인 실패');
    return { error: errorMessage };
  }
}

/**
 * 이메일/비밀번호 회원가입
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    const errorMessage = getAuthErrorMessage(err, '회원가입 실패');
    return { error: errorMessage };
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    const errorMessage = getAuthErrorMessage(err, '로그아웃 실패');
    return { error: errorMessage };
  }
}
