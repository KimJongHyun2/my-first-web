export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19 새 기능 정리",
    content: "React 19에서 달라진 주요 기능과 실무에서 활용할 수 있는 포인트를 정리했습니다.",
    author: "김코딩",
    date: "2026-03-30",
  },
  {
    id: 2,
    title: "Tailwind CSS 4 변경사항",
    content: "Tailwind CSS 4에서 달라진 설정 방식과 유틸리티 사용법을 예제와 함께 살펴봅니다.",
    author: "이디자인",
    date: "2026-03-28",
  },
  {
    id: 3,
    title: "Next.js 16 App Router 가이드",
    content: "Next.js 16 App Router의 핵심 개념과 페이지 구성 방법을 단계별로 설명합니다.",
    author: "박개발",
    date: "2026-03-25",
  },
];
