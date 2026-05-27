# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-20
- 완료된 작업: **Ch7~10 완전 완료** — 디자인, Supabase 연결, Auth 구현, Posts CRUD 완성
- 현재 작업: **Ch11 RLS 보안 구현** — 문서 정비 완료
- 다음: SQL 마이그레이션 작성 및 적용

## 기술 결정 사항

- 인증: Supabase Auth (이메일/비밀번호만 사용)
- 상태관리: React Context (AuthProvider)
- CRUD: `lib/posts.ts` 함수 기반
- 보호 라우트: middleware.ts 사용
- 수정/삭제 보안: UX는 Ch10, 실제 RLS는 Ch11
- 데이터 모델: Ch8 기준 `profiles` / `posts` 스키마 유지
- `profiles`: `id`, `username`, `avatar_url`, `role`, `created_at`
- `posts`: `id`, `user_id`, `title`, `content`, `created_at`

## 버전 정책

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치: Next.js 16.2.1 ✓, @supabase/supabase-js 2.105.1 (최신), @supabase/ssr 0.10.2 (최신)
- 수업 프롬프트는 교재 기준으로 통일, 빌드 오류는 package.json 기준으로 원인 확인

## 변경된 파일

- `.github/copilot-instructions.md`: Ch9 Auth + Ch10 CRUD 규칙 추가
- `ARCHITECTURE.md`: Ch8 데이터 모델과 Ch10 CRUD 흐름 반영
- `todo.md`: Ch10 CRUD 작업 세분화
- `.agent/rules/project.md`: Ch10 기준 프로젝트 규칙 재작성
- `docs/ch07a.md`: Ch8 스키마 이름으로 정리
- `docs/ch08a.md`: profiles/posts 스키마를 Ch8 기준으로 정리
- `app/posts/page.tsx` (Ch10): readPosts 구현, 로딩/에러/빈상태 처리
- `app/posts/[id]/page.tsx` (Ch10): readPostById + 작성자 UI 분기, notFound() 처리, 삭제 기능
- `app/posts/[id]/edit/page.tsx` (Ch10): updatePost 구현, 작성자 확인
- `app/posts/new/page.tsx` (Ch10): createPost 구현, Auth 체크

## Ch12: 에러 처리 및 UX 개선 (최근 작업)

- `app/error.tsx`: 앱 전체 에러 화면 (reset 지원)
- `app/loading.tsx`: 앱 전체 로딩 스켈레톤
- `app/posts/loading.tsx`: 게시글 목록 로딩 스켈레톤
- `app/posts/[id]/loading.tsx`: 상세 로딩 스켈레톤
- `app/posts/new/page.tsx`: 클라이언트 유효성 검사 추가 (제목 최소 2자, 내용 최소 10자, 제출 중 비활성화)
- `lib/error-message.ts`: Supabase/네트워크 에러를 사용자 친화적 메시지로 변환하는 유틸
- `components/LoginForm.tsx`, `components/SignupForm.tsx`: 위 유틸 적용 (개발자용 로그는 console.error로 유지)

에러 메시지 변환 규칙:
- 42501 또는 RLS 관련 오류 → "이 작업을 수행할 권한이 없습니다."
- "Failed to fetch" → "인터넷 연결을 확인해주세요."
- not found 계열 → "요청한 내용을 찾을 수 없습니다."
- 기본값 → "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."

## 해결된 이슈

- (Ch7) shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- (Ch7) 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체
- (Ch7) shadcn/ui 테마 조화 → app/globals.css 색상 변수 정리 완료

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용
- OKLCh 색상 포맷으로 밝기(L), 채도(C), 색상(h) 정밀 제어 가능
- 테마 변수만 수정해도 shadcn/ui 컴포넌트 전체 스타일 일관성 유지
- 규칙 파일에 명시한 Design Tokens과 Component Rules이 있으면 Copilot이 생성하는 코드 품질 향상
- shadcn/ui는 npm 패키지가 아니라 **복사 기반** — 컴포넌트 코드가 프로젝트에 온전히 포함되므로 AI가 수정 가능

## Supabase Auth 플로우 (Ch9)

### 구현 완료
- Auth Context 생성 (contexts/AuthContext.tsx)
- 로그인 페이지 (app/login/page.tsx)
- 회원가입 페이지 (app/signup/page.tsx)
- Middleware 설정 (middleware.ts)
- 보호 라우트 구현
- `npm run build` 통과

### 현재 동작
- 이메일/비밀번호 로그인과 회원가입이 Supabase Auth에 연결됨
- `AuthProvider`가 앱 전체의 로그인 상태를 관리함
- `/posts/new`는 비로그인 사용자를 `/login`으로 보냄
- 로그인/회원가입 화면은 `redirect` 쿼리를 유지해 원래 목적지로 복귀할 수 있음

## Supabase Posts CRUD (Ch10)

### 구현 완료
- ✅ 포스트 목록 조회 (`app/posts/page.tsx`) - readPosts
- ✅ 포스트 상세 조회 (`app/posts/[id]/page.tsx`) - readPostById + 작성자 UI 분기
- ✅ 포스트 작성 (`app/posts/new/page.tsx`) - createPost + Auth 체크
- ✅ 포스트 수정 (`app/posts/[id]/edit/page.tsx`) - updatePost + 작성자만 접근
- ✅ 포스트 삭제 (`app/posts/[id]/page.tsx`) - deletePost + confirm() 확인
- ✅ 프로덕션 빌드 성공 (`npm run build`)

### Supabase 쿼리 패턴

**조회 (Read)**
```typescript
const { data, error } = await supabase
  .from("posts")
  .select("id, title, content, created_at, user_id")
  .order("created_at", { ascending: false });
```

**생성 (Create)**
```typescript
const { data, error } = await supabase
  .from("posts")
  .insert({ title, content, user_id: user.id })
  .select()
  .single();
```

**수정 (Update)**
```typescript
const { error } = await supabase
  .from("posts")
  .update({ title, content })
  .eq("id", id);
```

**삭제 (Delete)**
```typescript
const { error } = await supabase
  .from("posts")
  .delete()
  .eq("id", post.id);
```

### 보안 전략

- **작성자 UI 분기**: `user?.id === post.user_id` 일 때만 수정/삭제 버튼 표시 (UX 레벨)
- **실제 보안은 Ch11 RLS에서 구현**: 클라이언트 분기는 보안이 아니며, RLS(Row Level Security)가 데이터베이스 단계에서 실제로 보호함
- **user_id는 항상 Auth context에서만**: 폼 입력이나 URL 파라미터로 받지 않음

### 에러 처리
- 쿼리 실패: console.error + 화면에 사용자 친화적 메시지 표시
- 존재하지 않는 포스트: `notFound()` 호출 (Next.js 404)
- 권한 없음: 상세 페이지 접근 시 UI 레벨에서 버튼 숨김

## Supabase Row Level Security (Ch11)

### RLS 활성화
- posts 테이블에 RLS 정책 적용 — 데이터베이스 단계에서 권한 강제
- 마이그레이션 파일: `supabase/migrations/<timestamp>_add_posts_rls.sql`
- CLI 명령어: `npx supabase migration new add_posts_rls` → `npx supabase db push`

### 적용 정책

| 작업 | 권한 | USING | WITH CHECK |
|------|------|-------|------------|
| SELECT | 누구나 읽기 | `true` | N/A |
| INSERT | 로그인 사용자만 | N/A | `auth.uid() = user_id` |
| UPDATE | 작성자만 수정 | `auth.uid() = user_id` | `auth.uid() = user_id` |
| DELETE | 작성자만 삭제 | `auth.uid() = user_id` | N/A |

### 테스트 시나리오 (완료 ✅)

**성공해야 하는 경우:**
- ① 비로그인 사용자가 게시글 목록/상세 조회 가능 ✅
- ② 로그인 사용자가 본인 글 작성 가능 ✅
- ③ 로그인 사용자가 본인 글 수정/삭제 가능 ✅

**실패해야 하는 경우 (RLS로 차단):**
- ④ 다른 사용자가 글 수정 시도 → 데이터 변경 없음 (error: null, data: []) ✅
- ⑤ 다른 사용자가 글 삭제 시도 → 데이터 삭제 없음 (error: null, data: []) ✅

### 검증 결과

**마이그레이션 파일:** `supabase/migrations/20260520041955_add_posts_rls.sql` ✅
- 파일 위치: [supabase/migrations/20260520041955_add_posts_rls.sql](supabase/migrations/20260520041955_add_posts_rls.sql)
- 상태: Git 언트랙(untracked) — 원하면 커밋 가능

**빌드 검증:** `npm run build` 성공 ✅

**민감 키 노출:** 검사 완료 ✅
- 스캔 항목: app/, lib/, components/, contexts/ 내 .ts, .tsx, .js
- 패턴: SUPABASE_SERVICE_ROLE, service_role, sb_secret_, sbp_, sk-
- 결과: 일치 항목 없음 (노출 없음)

**콘솔 테스트 결과:**
- 사용자 B(fab5e9c6-d44c-4a55-81d2-1eb8b71e8a7c) 로그인 ✅
- 사용자 A 글(65e2cba5-f293-42ce-bc2c-d97ff0103ead) 수정 시도 → RLS 차단 (data: []) ✅
- 사용자 A 글 삭제 시도 → RLS 차단 (data: []) ✅
- ④ 다른 사용자의 글을 수정하려고 시도 → 실패
- ⑤ 다른 사용자의 글을 삭제하려고 시도 → 실패
- ⑥ 콘솔/API로 직접 요청해도 RLS가 차단

### 핵심 원칙
- **클라이언트를 신뢰하지 않는다**: UI 분기(버튼 숨김)는 UX일 뿐, 실제 보안은 RLS가 담당
- **`auth.uid()`**: Supabase가 제공하는 현재 로그인 사용자의 ID (신뢰할 수 있음)
- **`USING`**: 기존 행을 읽거나 수정/삭제할 수 있는지 검사
- **`WITH CHECK`**: 새로 생성되거나 변경된 결과가 허용되는지 검사
- **마이그레이션으로 기록**: SQL Editor가 아닌 CLI 마이그레이션으로 정책을 코드에 남김

- `app/globals.css`: shadcn/ui 테마 변수 정리
  - :root 블록: OKLCh 포맷으로 정밀한 색상 조정 (밝기, 채도, 색상 각각 제어)
  - .dark 블록: 다크 모드 primary, ring, sidebar-primary 정합성 보정
  
- `.github/copilot-instructions.md`: 디자인 규칙 문서화
  - Design Tokens 섹션 추가 (색상, 간격, 반응형 규칙)
  - Component Rules 섹션 추가 (shadcn/ui 우선, 토큰 사용 강제)

- `components.json`: shadcn/ui 설정 파일 자동 생성
  - Tailwind CSS 경로, 아이콘 라이브러리(lucide), alias 설정

- `components/ui/`: 4개 컴포넌트 추가
  - button.tsx, card.tsx, input.tsx, dialog.tsx

- `lib/utils.ts`: Tailwind 유틸리티 함수
  - cn() 함수로 clsx와 twMerge 조합

- `ARCHITECTURE.md`: 완성된 설계 문서 ✅
  - Page Map, User Flow, Wireframe Sketches
  - Design Strategy (7.7): 디자인 토큰, 5가지 프롬프트 전략
  - Component Hierarchy (7.8.2): shadcn/ui 컴포넌트별 사용 위치
  - Data Model (7.8.1): users/posts 테이블 스키마 (SQL 포함)
  - Validation Checklist (7.8.3): 10가지 검증 항목
  - Next Steps: Ch8부터의 연동 계획

- `DESIGN_PROMPTS.md`: 실습용 프롬프트 모음
  - 7가지 실제 사용 가능한 프롬프트 템플릿
  - 각 전략별 활용법 및 실습 순서

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체
- shadcn/ui 테마를 블로그 분위기(깔끔하고 읽기 편한)에 맞춰야 함 → app/globals.css 색상 변수 정리 완료
  - :root의 색상 변수를 밝은 배경(oklch 0.99), 선명한 텍스트(oklch 0.2), 차분한 포인트(oklch 0.46) 톤으로 조정

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용
- OKLCh 색상 포맷으로 밝기(L), 채도(C), 색상(h) 정밀 제어 가능 (예: oklch(0.99 0.003 240))
- 테마 변수만 수정해도 shadcn/ui 컴포넌트 전체 스타일 일관성 유지
- 규칙 파일에 명시한 Design Tokens와 Component Rules이 있으면 Copilot이 생성하는 코드 품질 향상
- shadcn/ui는 npm 패키지가 아니라 **복사 기반** — 컴포넌트 코드가 프로젝트에 온전히 포함되므로 AI가 수정 가능
- `components.json`이 shadcn/ui의 설정 허브 — 여기서 alias, 스타일, 테마 기본값을 관리
- Copilot Vision으로 종이 스케치를 이미지로 촬영하면 AI가 코드로 변환 가능
- **디자인 프롬프트 5가지 전략** (표7.9):
  1. 레퍼런스 제시 ("Notion 스타일")
  2. 제약 조건 명시 ("shadcn/ui만 사용")
  3. 반복 다듬기 (단계별 수정)
  4. 부정 프롬프트 (하지 말 것)
  5. 역할 부여 ("미니멀리스트 디자이너로서")
- **초보자 프롬프트** 기본 원칙: 기술 용어보다 **느낌 + 조건 + 설명 요청**