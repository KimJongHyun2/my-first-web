import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Supabase environment variables are not configured." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.rpc("increment_post_like_count", {
    post_id_input: id,
  });

  if (error) {
    const isNotFound = error.message.includes("post_not_found");

    return NextResponse.json(
      { error: isNotFound ? "Post not found." : "Failed to like post." },
      { status: isNotFound ? 404 : 500 },
    );
  }

  return NextResponse.json({ likeCount: data });
}
