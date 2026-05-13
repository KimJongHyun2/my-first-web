# Project Rules — my-first-web (Ch9 기준)

## 프로젝트 상태
- **목표**: 개인 블로그 (포스트 읽기, 작성, 수정, 삭제)
- **현재 진행**: Ch9 Supabase Auth (로그인/회원가입, 보호 라우트)
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

### 4. 스타일 규칙
- **프레임워크**: Tailwind CSS 4 (globals.css + @theme 블록)
- **색상**: CSS 변수 (--primary, --secondary, --background 등) 사용
  - 직접 색상값(blue-500, red-600) 금지
- **컴포넌트**: shadcn/ui 우선 사용
- **반응형**: 
  - 모바일 우선 (xs 기본)
  - md 이상: 2열 그리드
  - 모바일: 1열 스택

### 5. 파일 구조 규칙

```
app/
├── layout.tsx           # Root Layout (Header, Footer)
├── page.tsx             # 홈 페이지 (/)
├── login/page.tsx       # 로그인 (/login)
├── signup/page.tsx      # 회원가입 (/signup)
├── posts/
│   ├── page.tsx         # 포스트 목록 (/posts)
│   ├── [id]/page.tsx    # 포스트 상세 (/posts/[id])
│   └── new/page.tsx     # 포스트 작성 (/posts/new) - 보호됨
└── mypage/page.tsx      # 마이페이지 (/mypage) - 보호됨

components/
├── ui/                  # shadcn/ui (button, card, input, dialog 등)
├── Header.tsx           # 공통 헤더
├── Footer.tsx           # 공통 푸터
├── PostCard.tsx         # 포스트 카드
└── AuthProvider.tsx     # Auth Context Provider

lib/
├── auth-context.ts      # Auth Context (signUp, signIn, signOut 메서드)
├── supabase/
│   ├── client.ts        # Supabase Client 초기화
│   └── server.ts        # Supabase Server Client (미들웨어, 서버 액션용)
├── posts.ts             # 포스트 조회 함수
└── utils.ts             # cn() 등 유틸리티

middleware.ts           # 보호 라우트 설정 (루트)
```

### 6. Supabase 파일 위치
- **Client**: `lib/supabase/client.ts`
  - `createBrowserClient()` 사용
  - Client Component에서만 import
  - Public 키만 사용
- **Server**: `lib/supabase/server.ts`
  - `createServerClient()` 또는 `createServiceRoleClient()` 사용
  - Server Component, API Routes, Middleware에서만 import
  - service_role 키는 `.env.local`에만 (절대 커밋 X)

### 7. 버전 관리
- **교재 기준**: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- **실제 설치**: package.json 참조 (현재 더 최신 버전일 수 있음)
  - @supabase/supabase-js 2.105.1
  - @supabase/ssr 0.10.2
- **수업 설명**: 교재 기준으로 통일 (API 차이 발생 시 package.json으로 원인 확인)

### 8. 환경 변수
- **public** (.env.local, 커밋 가능):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **private** (.env.local, 절대 커밋 금지):
  - `SUPABASE_SERVICE_ROLE_KEY`

### 9. 금지 사항
- ❌ 페이지 router 사용 (`pages/` 디렉토리)
- ❌ `next/router` 사용 (대신 `next/navigation` 사용)
- ❌ 직접 색상값 사용 (대신 CSS 변수 사용)
- ❌ 구버전 Supabase API (`auth.signIn()`, 대신 `signInWithPassword()`)
- ❌ 클라이언트에 service_role 키 노출
- ❌ 소셜 로그인 구현
- ❌ 불필요한 `use client` 선언

### 10. 테스트/검증 체크리스트
각 기능 구현 후 ARCHITECTURE.md의 Validation Checklist 참조
- 반응형 (모바일/태블릿/데스크톱)
- 접근성 (Lighthouse)
- 일관성 (색상, 간격)
- 컴포넌트 (shadcn/ui 올바른 import)
- 네비게이션 (링크 동작)
- 인증 (로그인/로그아웃 플로우)
- 보호 라우트 (미로그인 리다이렉트)

## 참고 문서
- [ARCHITECTURE.md](../ARCHITECTURE.md): 페이지 맵, 컴포넌트 구조, 데이터 모델, Auth 플로우
- [AGENTS.md](../AGENTS.md): 기본 기술 스택
- [.github/copilot-instructions.md](../.github/copilot-instructions.md): Design Tokens, Supabase Auth 규칙
- [context.md](../context.md): 프로젝트 진행 상황
- [todo.md](../todo.md): 작업 체크리스트
