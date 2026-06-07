"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, FileText, Mail, ThumbsUp, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

type PostStatsRow = {
  id: string;
  like_count?: number | null;
};

type ProfileStats = {
  postCount: number;
  receivedLikes: number;
};

const supabase = createClient();

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<ProfileStats>({ postCount: 0, receivedLikes: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadStats = async () => {
      setStatsLoading(true);

      let { data, error } = await supabase
        .from("posts")
        .select("id, like_count")
        .eq("user_id", user.id);

      if (error) {
        const fallbackResult = await supabase
          .from("posts")
          .select("id")
          .eq("user_id", user.id);

        data = fallbackResult.data?.map((post) => ({ ...post, like_count: 0 })) ?? null;
        error = fallbackResult.error;
      }

      if (error) {
        console.warn("Failed to load profile stats:", error);
        setStats({ postCount: 0, receivedLikes: 0 });
        setStatsLoading(false);
        return;
      }

      const posts = (data ?? []) as PostStatsRow[];
      setStats({
        postCount: posts.length,
        receivedLikes: posts.reduce((total, post) => total + (post.like_count ?? 0), 0),
      });
      setStatsLoading(false);
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <section className="apple-card mx-auto max-w-4xl p-6">
        <p className="text-sm text-slate-600">프로필을 불러오는 중...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="apple-card mx-auto max-w-4xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">로그인이 필요합니다</h1>
        <p className="text-sm text-slate-600">프로필을 보려면 먼저 로그인해 주세요.</p>
        <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
          <Link href="/login?redirect=/profile">로그인하기</Link>
        </Button>
      </section>
    );
  }

  const displayName = user.user_metadata?.name?.trim() || "이름 없음";
  const email = user.email || "이메일 없음";
  const joinedDate = formatDate(user.created_at) || "가입일 없음";
  const initial = displayName === "이름 없음" ? "M" : displayName.slice(0, 1).toUpperCase();

  const profileItems = [
    { label: "이름", value: displayName, icon: UserRound },
    { label: "이메일", value: email, icon: Mail },
  ];

  const statItems = [
    { label: "가입일", value: joinedDate, icon: CalendarDays },
    { label: "작성한 게시글", value: statsLoading ? "계산 중..." : `${stats.postCount}개`, icon: FileText },
    { label: "받은 좋아요", value: statsLoading ? "계산 중..." : `${stats.receivedLikes}개`, icon: ThumbsUp },
  ];

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Card className="p-0">
        <CardHeader className="p-6 pb-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Profile</p>
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            내 프로필
          </CardTitle>
          <CardDescription className="text-slate-600">
            현재 로그인한 계정 정보와 활동 요약을 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white/80 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white shadow-lg shadow-slate-900/10">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold tracking-tight text-slate-950">{displayName}</p>
              <p className="truncate text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profileItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  <p className="break-all text-base font-medium text-slate-950">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {statItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  <p className="text-xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
