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

- 파일: `lib/posts.ts`
- 함수: `createPost()`, `readPosts()`, `readPostById()`, `updatePost()`, `deletePost()`
- 클라이언트: Supabase Client (`lib/supabase/client.ts`)

### 작성/수정/삭제 규칙

- **생성** (`createPost`): user_id = 현재 로그인 사용자
- **조회** (`readPosts`, `readPostById`): 모두 조회 가능
- **수정** (`updatePost`): UX 레벨만 (작성자인지 체크)
	- 실제 보안은 Ch11 RLS에서 구현
- **삭제** (`deletePost`): UX 레벨만 (작성자인지 체크)
	- 실제 보안은 Ch11 RLS에서 구현

### 라우팅 규칙

- 작성: `/posts/new` (보호됨 - 로그인 필수)
- 상세 + 수정/삭제: `/posts/[id]` (작성자 버튼만 표시)
- 수정: `/posts/[id]/edit` (작성자만 접근 UX)
- 목록: `/posts` (모두 접근)

### 에러 처리

- 쿼리 실패: console.error + 사용자에게 토스트 알림
- 작성자 확인 실패: 버튼 숨김 (RLS가 실제 차단)
- 존재하지 않는 포스트: `notFound()` 사용

### 금지사항 (Ch10 이후)

**임의 변경 금지:**
- ❌ posts 테이블 컬럼명 임의 변경 (항상 `id, title, content, created_at, user_id` 사용)
- ❌ user_id를 폼 입력값이나 URL에서 받기 (항상 `user.id` from Auth context)
- ❌ `next/router` 사용 (항상 `next/navigation` 사용)
- ❌ `auth.signIn()` 사용 (항상 `signInWithPassword()` 사용)
- ❌ service_role 키를 클라이언트에서 사용 (ANON_KEY만 사용)
- ❌ 소셜 로그인 코드 추가 (이메일/비밀번호만)
- ❌ update/delete 쿼리에서 `.eq("id", postId)` 조건 생략

**보안 설명 금지:**
- UI 분기(user.id === post.user_id)를 "보안"이라고 설명하지 말 것
- 항상 "UX 레벨" 또는 "UI 레벨"이라고 명시
- "실제 보안은 Ch11 RLS에서 처리"라고 주석으로 남길 것

## Supabase RLS (Ch11)

### RLS 정책 규칙

- 마이그레이션 파일: `supabase/migrations/<timestamp>_add_posts_rls.sql`
- CLI 명령: `npx supabase migration new add_posts_rls` → `npx supabase db push`
- SQL Editor는 사용하지 않음 (Git 이력 추적을 위해 CLI 마이그레이션만 사용)

### posts 테이블 정책 (4개)

**1) SELECT — 누구나 읽기**
```sql
CREATE POLICY "Authenticated and anonymous users can read posts"
ON public.posts FOR SELECT
USING (true);
```

**2) INSERT — 로그인 사용자만, user_id는 본인**
```sql
CREATE POLICY "Authenticated users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**3) UPDATE — 작성자만 수정 (수정 후에도 user_id 유지)**
```sql
CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**4) DELETE — 작성자만 삭제**
```sql
CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);
```

### 금지사항 (Ch11)

**임의 변경 금지:**
- ❌ RLS 정책을 SQL Editor에서만 적용 (반드시 CLI 마이그레이션 사용)
- ❌ `USING` 또는 `WITH CHECK` 조건 생략
- ❌ INSERT/UPDATE에서 `WITH CHECK (auth.uid() = user_id)` 누락 (다른 user_id로 저장 가능)
- ❌ DELETE에서 `USING (auth.uid() = user_id)` 누락

**보안 설명 금지:**
- RLS 정책을 "보안"이 아니라 **"데이터베이스 강제"** 또는 **"최종 권한 검사"**라고 표현
- UI 분기는 "UX 레벨", RLS는 "DB 레벨 보안"이라고 명확히 구분

