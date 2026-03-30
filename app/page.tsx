export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
      <header className="border-b border-gray-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">김종현 블로그</h1>
            <p className="mt-3 text-sm text-gray-600">개발과 일상에서 배운 내용을 기록합니다.</p>
          </div>
          <nav aria-label="주요 메뉴" className="text-sm font-medium text-gray-700">
            <ul className="flex gap-2">
              <li className="rounded-full bg-gray-900 px-3 py-1.5 text-white">홈</li>
              <li className="rounded-full px-3 py-1.5 transition hover:bg-gray-100">소개</li>
              <li className="rounded-full px-3 py-1.5 transition hover:bg-gray-100">글목록</li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">최근 글</h2>

        <div className="mt-8 space-y-5">
          <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-2xl font-semibold tracking-tight">Next.js 16으로 블로그 시작하기</h3>
            <p className="mt-3 leading-7 text-gray-700">
              App Router 기반으로 블로그 메인 페이지를 설계하고 시맨틱 마크업을 적용한 과정을 정리했습니다.
            </p>
            <p className="mt-4 text-sm text-gray-500">작성자: 김종현</p>
            <p className="text-sm text-gray-500">날짜: 2026.03.30</p>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-2xl font-semibold tracking-tight">학부 프로젝트 협업 회고</h3>
            <p className="mt-3 leading-7 text-gray-700">
              역할 분담과 코드 리뷰 프로세스를 개선하면서 팀 생산성을 높인 경험을 공유합니다.
            </p>
            <p className="mt-4 text-sm text-gray-500">작성자: 김종현</p>
            <p className="text-sm text-gray-500">날짜: 2026.03.27</p>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-2xl font-semibold tracking-tight">프론트엔드 학습 기록 1주차</h3>
            <p className="mt-3 leading-7 text-gray-700">
              컴포넌트 분리 기준과 재사용 가능한 UI 구성 방법을 중심으로 학습한 내용을 요약했습니다.
            </p>
            <p className="mt-4 text-sm text-gray-500">작성자: 김종현</p>
            <p className="text-sm text-gray-500">날짜: 2026.03.24</p>
          </article>
        </div>
      </main>

      <footer className="border-t border-gray-200/80 bg-white/70">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 text-sm text-gray-600">
          <p>© 2026 김종현 블로그. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
