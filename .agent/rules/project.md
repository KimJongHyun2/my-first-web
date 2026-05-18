# Project Rules — my-first-web (Ch10 기준)

## 프로젝트 상태
- **목표**: 개인 블로그 (포스트 읽기, 작성, 수정, 삭제)
- **현재 진행**: Ch10 Posts CRUD (lib/posts.ts 함수, CRUD 페이지 구현)
- **기술 스택**: Next.js 16.2.1 (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui + Supabase

## 코드 작성 규칙

### 1. 라우터 규칙
- **필수**: Next.js App Router (`app/` 디렉토리) 사용
- **금지**: `pages/` 라우터, `next/router` 사용 불가
- **필수**: 라우트 이동 시 `next/navigation`의 `useRouter()` 또는 `redirect()` 사용

### 2. 컴포넌트 규칙
- **기본**: Server Component (특별히 필요 없으면 use client 추가 금지)
- **필요 조건**: 상호작용(onClick, onChange), 브라우저 API 필요 시에만 `use client` 선언
- **위치**:
  - UI 컴포넌트 (Button, Card, Input 등): `components/ui/` (shadcn/ui)
  - 커스텀 컴포넌트 (PostCard, Header 등): `components/`
  - 페이지 컴포넌트: `app/[route]/page.tsx`

### 3. Supabase Auth 규칙 (Ch9)
- **인증 타입**: 이메일/비밀번호만 (소셜 로그인 X)
- **API**: `signInWithPassword()` 사용 (구버전 `auth.signIn()` 금지)
- **환경변수**: `.env.local`에만 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Admin Client**: 서버 작업(RLS 설정 등)에만 service_role 키 사용 (클라이언트 금지)
- **상태 관리**: React Context (AuthProvider in `contexts/AuthContext.tsx`)
- **보호 라우트**: `middleware.ts` 사용 (pages router 미사용)

### 3-1. Posts CRUD 규칙 (Ch10)
- **데이터 모델**: Ch8 기준 posts/profiles 스키마 유지
- **파일**: `lib/posts.ts`
- **함수**: `createPost()`, `readPosts()`, `readPostById()`, `updatePost()`, `deletePost()`
- **라우팅**: `/posts/new` (작성), `/posts` (목록), `/posts/[id]` (상세), `/posts/[id]/edit` (수정)
- **보안**: 수정/삭제는 UX 레벨만, 실제 보안은 Ch11 RLS에서 처리

### 4. 스타일 규칙
- **프레임워크**: Tailwind CSS 4 (globals.css + @theme 블록)
- **색상**: CSS 변수 사용 (직접 색상값 금지)

## 참고 문서
- ARCHITECTURE.md: 페이지 맵, 컴포넌트 구조, 데이터 모델
- AGENTS.md: 기본 기술 스택
- .github/copilot-instructions.md: Design Tokens, Auth + CRUD 규칙
- context.md: 프로젝트 진행 상황
- todo.md: 작업 체크리스트
