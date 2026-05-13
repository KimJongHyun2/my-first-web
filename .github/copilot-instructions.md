@AGENTS.md를 참조하고, 아래는 **Supabase Auth 추가 규칙**입니다.

## Supabase Auth (Ch9)

### 버전 정책

- 교재 기준: @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치: @supabase/supabase-js 2.105.1, @supabase/ssr 0.10.2 (최신)
- 수업 프롬프트와 설명은 교재 기준으로 통일
- 빌드 오류는 package.json 기준으로 원인 확인

### 인증 규칙

- 이메일/비밀번호 인증만 사용 (소셜 로그인 X)
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Client 인증: `@supabase/supabase-js` + `signInWithPassword`
- Server 작업: Supabase Admin Client 사용 (service_role 키는 .env.local만)
- Auth 상태 관리: React Context + AuthProvider
- 보호 라우트: `middleware.ts` 사용 (pages router X)
- 구 API 금지: `auth.signIn()` X → `signInWithPassword()` 사용

### 파일 위치

- Auth Context: `contexts/AuthContext.tsx`
- Middleware: `middleware.ts` (프로젝트 루트)
- 로그인 페이지: `app/login/page.tsx`
- 회원가입 페이지: `app/signup/page.tsx`

