'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import * as authFunctions from '@/lib/auth';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 초기 사용자 상태 확인
    const getInitialUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user as User | null);
      } catch (error) {
        console.error('Failed to get initial user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // 인증 상태 변화 리스너 등록
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // cleanup: 리스너 제거 (안전하게 호출)
    return () => {
      try {
        if (data && (data as any).subscription && typeof (data as any).subscription.unsubscribe === 'function') {
          (data as any).subscription.unsubscribe();
        }
      } catch (e) {
        console.error('Failed to unsubscribe auth listener', e);
      }
    };
  }, [supabase]);

  const handleSignInWithEmail = async (email: string, password: string) => {
    const result = await authFunctions.signInWithEmail(email, password);
    if (!result.error) {
      // 성공 시 사용자 정보 갱신
      const { data } = await supabase.auth.getUser();
      setUser(data.user as User | null);
    }
    return { error: result.error };
  };

  const handleSignUpWithEmail = async (email: string, password: string, name: string) => {
    const result = await authFunctions.signUpWithEmail(email, password, name);
    if (!result.error) {
      // 성공 시 사용자 정보 갱신
      const { data } = await supabase.auth.getUser();
      setUser(data.user as User | null);
    }
    return { error: result.error };
  };

  const handleSignOut = async () => {
    const result = await authFunctions.signOut();
    if (!result.error) {
      setUser(null);
    }
    return { error: result.error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail: handleSignUpWithEmail,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
