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
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">블로그</h1>
      <PostsClient initialPosts={posts} />
    </section>
  );
}
