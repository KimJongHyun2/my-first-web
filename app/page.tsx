export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-end justify-between px-4 py-8">
          <div>
            <h1 className="text-3xl font-bold">김종현 블로그</h1>
            <p className="mt-2 text-sm text-gray-600">한신대학교 정보통신학부 · 취미 운동, 코딩</p>
          </div>
          <nav className="text-sm text-gray-600">
            <ul className="flex gap-4">
              <li>홈</li>
              <li>소개</li>
              <li>글목록</li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">최근 글</h2>
          <p className="mt-2 text-sm text-gray-600">개발과 일상에서 배운 내용을 기록합니다.</p>
        </div>

        <div className="space-y-8">
          <article className="border-b border-gray-200 pb-6">
            <h3 className="text-2xl font-semibold">첫 번째 포스트를 준비 중입니다</h3>
            <p className="mt-2 text-sm text-gray-500">2026.03.25</p>
            <p className="mt-3 leading-7 text-gray-700">
              Next.js와 Tailwind CSS를 사용해 블로그를 만드는 과정을 정리할 예정입니다.
            </p>
          </article>

          <article className="border-b border-gray-200 pb-6">
            <h3 className="text-2xl font-semibold">학교 프로젝트 회고</h3>
            <p className="mt-2 text-sm text-gray-500">2026.03.20</p>
            <p className="mt-3 leading-7 text-gray-700">
              정보통신학부 프로젝트에서 배운 점과 개선하고 싶은 부분을 정리합니다.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
