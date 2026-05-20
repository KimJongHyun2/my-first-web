# Architecture — my-first-web

## 프로젝트 목표

- **목표**: 개인 블로그 - 글 작성, 목록, 상세 조회 기능 제공
- **대상 사용자**: 블로그 독자 / 블로그 운영자(작성자)
- **기술 스택**: Next.js 16(App Router) + React 19 + Tailwind CSS 4 + shadcn/ui

## Non-Goals (MVP에 포함하지 않음)

- 마이페이지 (Ch12에서 추가)
- 댓글 기능 (Ch12에서 추가)

## Page Map (페이지 맵)

### URL 구조 (Next.js App Router 기준)

| 페이지 | URL | 파일 | 설명 |
|--------|-----|------|------|
| 홈 | `/` | `app/page.tsx` | 블로그 시작 페이지 |
| 포스트 목록 | `/posts` | `app/posts/page.tsx` | 포스트 카드 리스트 |
| 포스트 상세 | `/posts/[id]` | `app/posts/[id]/page.tsx` | 포스트 전문 조회 + 작성자 수정/삭제 버튼 |
| 포스트 작성 | `/posts/new` | `app/posts/new/page.tsx` | 포스트 작성 폼 (로그인 필수) |
| 포스트 수정 | `/posts/[id]/edit` | `app/posts/[id]/edit/page.tsx` | 포스트 수정 폼 (작성자만) |
| 로그인 | `/login` | `app/login/page.tsx` | 이메일 로그인 |
| 회원가입 | `/signup` | `app/signup/page.tsx` | 이메일 회원가입 |
| 마이페이지 | `/mypage` | `app/mypage/page.tsx` | 내 포스트 관리 (로그인 필수) |

## User Flow (유저 플로우)

### 1) 글 읽기 (비로그인 사용자)
```
홈 → "포스트" 메뉴 클릭 → 포스트 목록 조회 → 카드 클릭 → 포스트 상세 조회
```

### 2) 글 작성 (로그인 필요)
```
포스트 목록 → "새 글 쓰기" 버튼 클릭
  ↓
  [로그인 상태 확인]
│                                          │
│  비밀번호: [________________]           │ ← Input
  - 미로그인 → /login 페이지 리다이렉트 → 로그인 완료 → /posts/new로 자동 복귀
```

### 3) 글 수정/삭제 (로그인한 작성자만)
```
포스트 상세 → [작성자 확인]
  ↓
  작성자: [수정] [삭제] 버튼 표시
  비작성자: 버튼 숨김
  ↓
  [수정] → /posts/[id]/edit → 제목/내용 수정 → 저장 → 상세로 복귀
  [삭제] → confirm() → 삭제 → /posts 목록으로 이동
```
- 작성자 판단: `user?.id === post.user_id` (UI 레벨)
- 실제 보안: Ch11 RLS(Row Level Security)에서 구현

### 4) 마이페이지 확인 (로그인 필수)
```
헤더 → "마이페이지" 메뉴 클릭 → [로그인 확인] → 내 포스트 목록 조회
  ↓
  카드에서 수정/삭제 가능
```

## Security Layer (보안 계층) — Ch11 RLS

### UI 레벨 vs DB 레벨

| 계층 | 방식 | 담당 | 보안인가? |
|------|------|------|----------|
| **UI (UX)** | `user?.id === post.user_id` 버튼 숨김 | React 컴포넌트 | ❌ UX일 뿐 |
| **Database (RLS)** | `auth.uid() = user_id` PostgreSQL 정책 | Supabase RLS | ✅ 실제 보안 |

### 핵심 원칙
- **클라이언트를 신뢰하지 않는다**: 개발자 도구나 직접 API 요청으로 UI를 우회할 수 있음
- **데이터베이스가 최종 권한을 검사**: RLS 정책이 모든 쿼리 결과를 필터링함
- **UI 분기와 RLS은 별개**: UI는 사용자 경험을 위해, RLS는 실제 데이터 보호를 위해

### posts 테이블 RLS 정책 (Ch11 ✅ 완료)

| 작업 | 정책 | USING | WITH CHECK |
|------|------|-------|-----------|
| SELECT | 누구나 읽기 | `true` | N/A |
| INSERT | 로그인한 사용자 | N/A | `auth.uid() = user_id` |
| UPDATE | 작성자만 수정 | `auth.uid() = user_id` | `auth.uid() = user_id` |
| DELETE | 작성자만 삭제 | `auth.uid() = user_id` | N/A |

**결과**: 콘솔이나 직접 요청으로도 다른 사람의 글을 수정/삭제할 수 없음

**마이그레이션 파일**: [supabase/migrations/20260520041955_add_posts_rls.sql](supabase/migrations/20260520041955_add_posts_rls.sql)

## Component Hierarchy (컴포넌트 구조)
- Layout 구조 (Header, Main, Footer)
- 각 페이지의 주요 컴포넌트
- shadcn/ui 컴포넌트 조합

## Wireframe Sketches (와이어프레임)

### 1) 포스트 목록 페이지 (/posts)

```
┌──────────────────────────────────────────┐
│  Logo      [포스트] [소개]  [로그인]     │ ← Header
├──────────────────────────────────────────┤
│  │ 작성일: 2026-04-29                  ││
│  │ 본문 미리보기...                    ││
│                                          │
│  📝 새 글 쓰기                          │ ← CTA Button
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ 📄 포스트 제목 1                    ││ ← PostCard
│  │ 작성일: 2026-04-29                  ││
│  │ 본문 미리보기...                    ││
│  └─────────────────────────────────────┘│
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ 📄 포스트 제목 2                    ││ ← PostCard
│  │ 작성일: 2026-04-28                  ││
│  │ 본문 미리보기...                    ││
│  └─────────────────────────────────────┘│
│                                          │
├──────────────────────────────────────────┤
│ © 2026 My Blog      RSS   Twitter       │ ← Footer
└──────────────────────────────────────────┘
```

**구성 요소**:
- Header: 로고, 네비게이션, 로그인 버튼
- Main: "새 글 쓰기" CTA 버튼 + PostCard 리스트 (1열)
- Footer: 저작권, 소셜 링크

### 2) 포스트 상세 페이지 (/posts/[id])

```
┌──────────────────────────────────────────┐
│  Logo      [포스트] [소개]  [로그인]     │ ← Header
├──────────────────────────────────────────┤
│                                          │
│  📄 포스트 제목이 여기 들어갑니다       │ ← 제목
│  ─────────────────────────────────────  │
│                                          │
│  포스트 본문이 여기에 길게 표시됩니다.  │ ← 본문
│  마크다운 형식이거나 평문입니다.       │
│  단락 구분이 명확합니다.                │
│                                          │
│  ─────────────────────────────────────  │
│                                          │
│  [← 목록으로] [수정] [삭제]            │ ← 액션 버튼 (작성자만)
│                                          │
├──────────────────────────────────────────┤
│ © 2026 My Blog      RSS   Twitter       │ ← Footer
└──────────────────────────────────────────┘
```

**구성 요소**:
- Header: 로고, 네비게이션
- Main: 제목 + 메타정보 + 본문 + 액션 버튼
- Footer: 저작권, 소셜 링크

### 3) 로그인 페이지 (/login)

```
┌──────────────────────────────────────────┐
│  Logo      [포스트] [소개]             │ ← Header (로그인 버튼 제거)
├──────────────────────────────────────────┤
│                                          │
│         🔐 로그인                       │ ← 제목
│                                          │
│  ─────────────────────────────────────  │
│                                          │
│  이메일:  [________________]            │ ← Input
│                                          │
│  비밀번호: [________________]           │ ← Input
│                                          │
│  [     로그인 하기     ]                │ ← Button (Primary)
│                                          │
│  계정이 없으신가요? [회원가입]          │ ← Link
│                                          │
├──────────────────────────────────────────┤
│ © 2026 My Blog      RSS   Twitter       │ ← Footer
└──────────────────────────────────────────┘
```

**구성 요소**:
- Header: 로고, 네비게이션
- Main: 제목 + 이메일 Input + 비밀번호 Input + 로그인 버튼 + 회원가입 링크
- Footer: 저작권

### 4) 포스트 작성 페이지 (/posts/new)

```
┌──────────────────────────────────────────┐
│  Logo      [포스트] [소개]  [로그아웃]  │ ← Header (로그인 상태)
├──────────────────────────────────────────┤
│                                          │
│         ✍️ 새 글 쓰기                    │ ← 제목
│                                          │
│  제목:                                  │
│  [________________]                     │ ← Input
│                                          │
│  내용:                                  │
│  [____________________________]          │
│  [____________________________]          │ ← Textarea
│  [____________________________]          │
│                                          │
│  [     글 남기기     ] [취소]            │ ← Button
│                                          │
├──────────────────────────────────────────┤
│ © 2026 My Blog      RSS   Twitter       │ ← Footer
└──────────────────────────────────────────┘
```

**구성 요소**:
- Header: 로고, 네비게이션 (로그인 상태)
- Main: 제목 + 제목 Input + 내용 Textarea + 저장/취소 버튼
- Footer: 저작권

**주요 기능**:
- useAuth()로 로그인 확인 → 미로그인 시 /login으로 리다이렉트
- 제목/내용 필수 유효성 검사
- Supabase insert: `{ title, content, user_id: user.id }`
- 성공 시 `/posts/[id]`로 이동

### 5) 포스트 수정 페이지 (/posts/[id]/edit)

```
┌──────────────────────────────────────────┐
│  Logo      [포스트] [소개]  [로그아웃]  │ ← Header
├──────────────────────────────────────────┤
│                                          │
│         ✏️ 글 수정하기                   │ ← 제목
│                                          │
│  제목:                                  │
│  [기존 제목이 여기 들어갑니다]          │ ← Input (pre-filled)
│                                          │
│  내용:                                  │
│  [기존 내용이 여기에 길게               │
│   표시됩니다.]                          │ ← Textarea (pre-filled)
│                                          │
│  [   수정 저장하기   ] [취소]           │ ← Button
│                                          │
├──────────────────────────────────────────┤
│ © 2026 My Blog      RSS   Twitter       │ ← Footer
└──────────────────────────────────────────┘
```

**구성 요소**:
- Header: 로고, 네비게이션
- Main: 제목 + 제목 Input(pre-filled) + 내용 Textarea(pre-filled) + 수정/취소 버튼
- Footer: 저작권

**주요 기능**:
- useAuth() + 작성자 확인 → 비작성자 시 notFound() 호출
- 기존 제목/내용 로드 및 화면에 표시
- Supabase update: `.update({ title, content }).eq("id", id)`
- 성공 시 `/posts/[id]`로 이동

### 6) 포스트 삭제 (포스트 상세 페이지에서)

**삭제 버튼 표시 (작성자만)**:
```typescript
{isAuthor ? (
  <button onClick={() => handleDelete()}>삭제</button>
) : null}
```

**삭제 확인 절차**:
```typescript
if (!confirm("정말로 이 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
  return;
}
```

**삭제 쿼리**:
```typescript
const { error } = await supabase
  .from("posts")
  .delete()
  .eq("id", post.id);
```

**주요 기능**:
- 작성자만 삭제 버튼 표시 (UI 레벨)
- confirm() 으로 사용자 재확인
- Supabase delete with `.eq("id")` 조건
- 성공 시 `/posts` 목록으로 이동

---

**구성 요소**:
- Header: 로고, 네비게이션
- Main: 제목 + 이메일 Input + 비밀번호 Input + 로그인 버튼 + 회원가입 링크
- Footer: 저작권

## Copilot Vision 프롬프트 템플릿

종이에 위 와이어프레임을 손그림으로 스케치한 후, **Copilot Chat에 이미지를 첨부하고** 아래 프롬프트를 사용하세요.

```

[조건]
- App Router 구조 사용 (pages/ 사용 금지)
- 현재 프로젝트의 package.json 기준으로 버전 확인
- next/router 사용 금지, next/navigation 사용
- 레이아웃은 스케치와 최대한 비슷하게
- 색상은 회색 계열로 단순하게 (shadcn/ui 기본값)

[요청]
- 변경할 파일 목록과 이유 설명
- 각 파일의 코드 (전체 또는 주요 부분)
- 주의사항 (로그인 리다이렉트, 권한 체크 등)
```

## Design Strategy (디자인 프롬프트 전략)

### 7.7.1 디자인 토큰이란

**디자인 토큰(Design Token)**: 색상, 폰트, 간격 등 디자인 규칙을 변수로 정리한 "앱의 디자인 규칙집"

**토큰이 없으면 (문제)**:
- AI가 매번 다른 색상 사용 (`blue-500`, `indigo-600`, `sky-400`...)
- 페이지마다 간격이 다름 (`p-4`, `p-6`, `p-8`...)
- 일관성 없는 UI 생성

**토큰이 있으면 (해결)**:
- AI가 정해진 색상만 사용 (`primary`, `secondary`, `accent`)
- 모든 페이지에서 동일한 간격 규칙 준수
- 일관된 UI 유지 ✅

### 7.7.2 현재 프로젝트의 디자인 토큰

**.github/copilot-instructions.md에 정의됨:**
```
- Primary: --primary (어두운 파란색)
- Background: --background (밝은 배경)
- Card: rounded-lg shadow-sm
- Spacing: space-y-6, p-6
- Max width: max-w-4xl mx-auto
- Responsive: md 2열, 모바일 1열
```

### 7.7.3 디자인 프롬프트 5가지 전략

| # | 전략 | 설명 | 예시 |
|---|------|------|------|
| 1 | **레퍼런스 제시** | 참고할 UI/사이트 명시 | "Notion 사이드바 스타일" |
| 2 | **제약 조건 명시** | 사용할 컴포넌트/색상 제한 | "shadcn/ui Card만, primary 색상" |
| 3 | **반복 다듬기** | 단계적 수정 | "간격 더 넓게" → "폰트 키워줘" |
| 4 | **부정 프롬프트** | 하지 말 것 명시 | "그라디언트 금지, 그림자 최소화" |
| 5 | **역할 부여** | AI에게 디자인 역할 지정 | "미니멀리스트 UI 디자이너로서" |

### 7.7.4 초보자용 디자인 프롬프트 개선

**나쁜 프롬프트 vs 좋은 프롬프트:**

| 항목 | ❌ 막연한 프롬프트 | ✅ 초보자용 개선 |
|------|---|---|
| 색상 | "예쁘게 해줘" | "개인 블로그답게 밝고 읽기 편한 색. 주요 버튼만 눈에 띄게" |
| 레이아웃 | "깔끔하게" | "글 목록을 보기 좋게. 제목, 요약, 작성일이 명확하게" |
| 컴포넌트 | "카드로 만들어" | "글 하나가 하나의 묶음처럼 보이도록. shadcn/ui 적절한 것 선택" |
| 반응형 | "모바일도 되게" | "휴대폰에서 읽기 편하게. 화면 좁을 때 내용 자연스럽게 쌓이도록" |

**초보자를 위한 프롬프트 템플릿:**
```
이 페이지를 개인 블로그답게 보기 좋게 정리해줘.

원하는 느낌:
- 깔끔하고 읽기 편함
- 배경은 밝게
- 주요 버튼만 눈에 띄도록
- 지나친 장식 없음

기능:
- 나는 Tailwind나 shadcn/ui를 잘 모른다
- 너가 적절한 컴포넌트와 클래스 선택해줘
- 기존 기능은 그대로 유지

수정 후:
- 어떤 컴포넌트를 사용했는지 쉽게 설명해줘
```

## Component Hierarchy (컴포넌트 구조)

### Layout 기본 구조

```
app/layout.tsx (Root Layout)
├── Header (공통 헤더)
│   ├── Logo (링크: /)
│   ├── Navigation Menu
│   │   ├── "포스트" 링크 (/posts)
│   │   ├── "소개" 링크 (/about) [선택]
│   │   └── 로그인 상태에 따라:
│   │       ├── 미로그인: "로그인" Button (/login)
│   │       └── 로그인: "마이페이지" + "로그아웃"
│   └── Mobile Menu (Hamburger - 모바일)
├── Main (페이지별 콘텐츠)
└── Footer (공통 푸터)
    ├── © 2026 My Blog
    └── 소셜 링크 [선택]
```

### 페이지별 컴포넌트 사용

#### 1) 홈 (/)
- Hero 섹션: 제목 + 설명
- CTA Button: "포스트 읽기" → /posts

#### 2) 포스트 목록 (/posts)
**컴포넌트**:
- Button: "새 글 쓰기" (로그인 필요 → /posts/new로 리다이렉트 또는 /login)
- Card (shadcn/ui): 포스트 카드
  - CardHeader: 제목
  - CardContent: 본문 미리보기
  - CardFooter: 작성일 + 작성자
- Button: "읽기" (→ /posts/[id])

**레이아웃**: 1열 스택 (모바일), md 이상 2열 그리드

#### 3) 포스트 상세 (/posts/[id])
**컴포넌트**:
- 제목 + 메타정보 (작성일, 작성자)
- 본문 콘텐츠
- Button: "목록으로" (→ /posts)
- Button (조건부): "수정", "삭제" (작성자만 표시)
- Dialog: 삭제 확인

#### 4) 포스트 작성 (/posts/new) — 로그인 필수
**컴포넌트**:
- Input: 포스트 제목 (shadcn/ui)
- Textarea [또는 ContentEditable]: 포스트 본문
- Button: "임시 저장" (선택)
- Button: "발행" (primary)
- Button: "취소" (outline)

#### 5) 로그인 (/login)
**컴포넌트**:
  - Input: 이메일
  - Input: 비밀번호
  - Button: "로그인" (primary)
  - Link: "계정이 없으신가요? 회원가입" (→ /signup)

#### 6) 회원가입 (/signup)
**컴포넌트**:
- Card: 회원가입 폼
  - Input: 이메일
  - Input: 비밀번호
  - Button: "회원가입" (primary)
  - Link: "이미 계정이 있으신가요? 로그인" (→ /login)

#### 7) 마이페이지 (/mypage) — 로그인 필수
**컴포넌트**:
- Card: 사용자 프로필 (이름, 이메일)
- Button: "프로필 수정" (선택)
- 포스트 목록 (포스트 목록과 동일하되, 추가 기능):
  - Button: "수정" (각 카드에)
  - Button: "삭제" (각 카드에)
  - Dialog: 삭제 확인

### shadcn/ui 컴포넌트 사용 정리

| 컴포넌트 | 활용처 | 변형 |
|---------|--------|------|
| **Button** | CTA, 네비게이션, 폼 제출, 수정/삭제 | variant: default, outline, ghost |
| **Card** | 포스트 카드, 프로필 카드, 폼 컨테이너 | Header, Content, Footer |
| **Input** | 제목, 이메일, 비밀번호, 검색 | type: text, email, password |
| **Dialog** | 삭제 확인, 중요 경고 | Trigger, Content, Header, Footer |

## Data Model (데이터 모델)

### 7.8.1 테이블 설계 (Supabase PostgreSQL 기준)

#### profiles 테이블

```sql
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  role text,
  created_at timestamptz default now()
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | 사용자 고유 ID, `auth.users(id)` 참조 |
| username | text | 사용자 이름 |
| avatar_url | text | 프로필 이미지 URL |
| role | text | 사용자 역할 |
| created_at | timestamptz | 생성 시각 |

---

#### posts 테이블

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text,
  content text,
  created_at timestamptz
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | 포스트 고유 ID |
| user_id | uuid | 작성자 ID, `profiles.id` 참조 |
| title | text | 포스트 제목 |
| content | text | 포스트 내용 |
| created_at | timestamptz | 생성 시각 |

---

#### 테이블 관계

**1:N 관계** (One-to-Many)
```
profiles (1) ─── posts (N)
  │
  └─ 한 명의 사용자(profiles)는 여러 개의 글(posts)을 작성할 수 있다
  └─ posts.user_id는 profiles.id를 참조
```

---

## Auth Flow (인증 플로우 - Ch9)

### 인증 시스템 개요

**기술**:
- Supabase Auth (Email/Password 기반)
- React Context (AuthProvider)
- middleware.ts (보호 라우트)

**규칙**:
- 이메일/비밀번호 인증만 사용 (소셜 로그인 X)
- signInWithPassword() 사용 (구버전 auth.signIn() 금지)
- service_role 키는 서버에만 (.env.local)

### 1) 회원가입 플로우 (/signup)

```
사용자 입력 (이메일, 비밀번호)
  ↓
Supabase Auth에 회원가입 (supabase.auth.signUp)
  ↓
  profiles 테이블에 프로필 정보 저장
  ↓
자동 로그인 또는 로그인 페이지로 리다이렉트
```

**구현 파일**:
- `app/signup/page.tsx`: 회원가입 폼
- `contexts/AuthContext.tsx`: Auth Context (signUp 메서드)

### 2) 로그인 플로우 (/login)

```
사용자 입력 (이메일, 비밀번호)
  ↓
Supabase Auth에 로그인 (supabase.auth.signInWithPassword)
  ↓
AuthContext 업데이트 (user, session)
  ↓
이전 페이지 또는 /posts로 리다이렉트
```

**구현 파일**:
- `app/login/page.tsx`: 로그인 폼
- `contexts/AuthContext.tsx`: Auth Context (signIn 메서드)

### 3) 보호 라우트 (/posts/new, /mypage)

로그인이 필수인 페이지는 middleware.ts에서 인증 확인:

```typescript
// middleware.ts 구조
const protectedPaths = ['/posts/new', '/mypage'];

if (isProtectedPath && !hasSession) {
  redirect('/login?redirect=/original-path');
}
```

**보호되는 라우트**:
- `/posts/new` (포스트 작성)
- `/mypage` (마이페이지)

**미보호 라우트**:
- `/` (홈)
- `/posts` (포스트 목록)
- `/posts/[id]` (포스트 상세)
- `/login` (로그인)
- `/signup` (회원가입)

### 4) 로그아웃

```
사용자 "로그아웃" 버튼 클릭
  ↓
Supabase Auth 세션 제거 (supabase.auth.signOut)
  ↓
AuthContext 업데이트 (user = null)
  ↓
홈으로 리다이렉트
```

### Auth Context 구조 (contexts/AuthContext.tsx)

```typescript
interface AuthContext {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp(email: string, password: string, name: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  refreshUser(): Promise<void>;
}

// Provider
<AuthProvider>
  {children}
</AuthProvider>
```

---

## Validation Checklist (검증 체크리스트 - 7.8.3)

AI가 생성한 UI/UX를 검증하기 위한 체크리스트입니다. 각 페이지 완성 후 확인하세요.

| # | 항목 | 확인 내용 | 확인 방법 |
|---|------|---------|---------|
| 1 | **반응형** | 모바일(375px), 태블릿(768px), 데스크톱(1280px)에서 레이아웃이 깨지지 않는가? | Chrome DevTools → 반응형 모드 (F12 → Ctrl+Shift+M) |
| 2 | **접근성** | 이미지에 alt 속성, 버튼에 의미 있는 텍스트, 충분한 색상 대비가 있는가? | Lighthouse (DevTools → Lighthouse → 접근성) |
| 3 | **일관성** | 모든 페이지에서 동일한 색상/간격 토큰을 사용하는가? | 육안 비교 또는 DevTools 요소 검사 |
| 4 | **컴포넌트** | shadcn/ui 컴포넌트를 올바르게 import했는가? | 파일에서 `@/components/ui/` 경로 확인 |
| 5 | **네비게이션** | 모든 페이지 간 이동이 ARCHITECTURE.md 페이지 맵과 일치하는가? | 직접 링크 클릭하며 테스트 |
| 6 | **코드 구조** | 컴포넌트 파일 위치가 ARCHITECTURE.md 컴포넌트 계층과 일치하는가? | 파일 트리 확인 (`app/`, `components/` 구조) |
| 7 | **타이포그래피** | 제목과 본문의 폰트 크기가 읽기 편한가? | 모바일(16px 이상)과 데스크톱에서 확인 |
| 8 | **터치 영역** | 버튼과 링크가 최소 44×44px 이상인가? (모바일) | DevTools 요소 검사에서 패딩 확인 |
| 9 | **컬러 대비** | 텍스트와 배경의 색상 대비가 WCAG AA 기준(4.5:1) 이상인가? | Lighthouse 또는 WebAIM Contrast Checker |
| 10 | **기능 유지** | 기존 데이터/기능이 그대로 동작하는가? | 포스트 목록 조회, 상세 조회, 링크 이동 등 테스트 |

---

## Next Steps (다음 단계)

1. **Ch8 (Supabase 연동)**:
   - Supabase 프로젝트 생성
   - users, posts 테이블 생성 (위의 SQL 기반)
   - 인증 설정 (이메일/비밀번호)

2. **Ch9 (CRUD 구현)**:
   - Copilot에게 ARCHITECTURE.md 제공하며 각 페이지 구현
   - DESIGN_PROMPTS.md의 프롬프트 활용

3. **Ch11 (보안 - RLS)**:
   - Supabase RLS 규칙 설정 (사용자별 접근 제어)
