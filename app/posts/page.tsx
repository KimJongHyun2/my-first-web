import PostsClient from "@/components/PostsClient";
import { posts as fallbackPosts, type Post } from "@/lib/posts";

type JsonPlaceholderPost = {
  id: number;
  title: string;
  body: string;
};

const formatDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=12", {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const apiPosts: JsonPlaceholderPost[] = await response.json();

    return apiPosts.map((post, index) => ({
      id: post.id,
      title: post.title,
      content: post.body,
      author: `작성자 ${post.id}`,
      date: formatDate(index),
    }));
  } catch {
    return fallbackPosts;
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <section className="space-y-8">
      <div className="apple-card p-8 sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Posts</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          게시글 목록
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          최근에 적은 기록들을 한눈에 살펴보세요.
        </p>
      </div>

      <PostsClient initialPosts={posts} />
    </section>
  );
}
