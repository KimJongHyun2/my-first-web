# Architecture — my-first-web

## 프로젝트 목표

- **목표**: 개인 블로그 - 글 작성, 목록, 상세 조회 기능 제공
- **대상 사용자**: 블로그 독자 / 블로그 운영자(작성자)
- **기술 스택**: Next.js 16(App Router) + React 19 + Tailwind CSS 4 + shadcn/ui

## Non-Goals (MVP에 포함하지 않음)

- 댓글 기능 (Phase 2)
- 검색/필터 (Phase 2)
- 이미지 업로드 (Phase 2)

## Page Map (페이지 맵)

### URL 구조 (Next.js App Router 기준)

| 페이지 | URL | 파일 | 설명 |
|--------|-----|------|------|
| 홈 | `/` | `app/page.tsx` | 블로그 시작 페이지 |
| 포스트 목록 | `/posts` | `app/posts/page.tsx` | 포스트 카드 리스트 |
| 포스트 상세 | `/posts/[id]` | `app/posts/[id]/page.tsx` | 포스트 전문 조회 |
| 포스트 작성 | `/posts/new` | `app/posts/new/page.tsx` | 포스트 작성 폼 (로그인 필요) |
| 로그인 | `/login` | `app/login/page.tsx` | 이메일 로그인 |
| 회원가입 | `/signup` | `app/signup/page.tsx` | 이메일 회원가입 |
| 마이페이지 | `/mypage` | `app/mypage/page.tsx` | 내 포스트 관리 (로그인 필요) |

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
  - 미로그인 → /login 페이지 리다이렉트 → 로그인 완료 → /posts/new로 자동 복귀
  - 로그인 완료 → 제목/내용 입력 → 제출 → 포스트 상세 페이지로 이동
```

### 3) 마이페이지 확인 (로그인 필요)
```
헤더 → "마이페이지" 메뉴 클릭 → [로그인 확인] → 내 포스트 목록 조회
  ↓
  카드에서 수정/삭제 가능
```

## Component Hierarchy (컴포넌트 구조)

TODO: shadcn/ui 설치 후 추가 예정

- Layout 구조 (Header, Main, Footer)
- 각 페이지의 주요 컴포넌트
- shadcn/ui 컴포넌트 조합

## Wireframe Sketches (와이어프레임)

### 1) 포스트 목록 페이지 (/posts)

```
┌──────────────────────────────────────────┐
│  Logo      [포스트] [소개]  [로그인]     │ ← Header
├──────────────────────────────────────────┤
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
│  작성일: 2026-04-29  | 작성자: 홍길동  │ ← 메타정보
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

## Copilot Vision 프롬프트 템플릿

종이에 위 와이어프레임을 손그림으로 스케치한 후, **Copilot Chat에 이미지를 첨부하고** 아래 프롬프트를 사용하세요.

```
첨부한 손그림 스케치를 Next.js + Tailwind CSS 컴포넌트로 변환해줘.

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
- Card: 로그인 폼
  - Input: 이메일
  - Input: 비밀번호
  - Button: "로그인" (primary)
  - Link: "계정이 없으신가요? 회원가입" (→ /signup)

#### 6) 회원가입 (/signup)
**컴포넌트**:
- Card: 회원가입 폼
  - Input: 이메일
  - Input: 비밀번호
  - Input: 비밀번호 확인
  - Input: 이름
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

#### users 테이블

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 사용자 고유 ID (자동 생성) |
| email | TEXT | 이메일 주소 (로그인용, 중복 불가) |
| name | TEXT | 사용자 이름 (블로그 글쓴이로 표시) |
| avatar_url | TEXT | 프로필 이미지 URL (선택) |
| role | TEXT | 역할 ('user' 또는 'admin') |
| created_at | TIMESTAMP | 가입 일시 (자동 기록) |
| updated_at | TIMESTAMP | 마지막 수정 일시 (자동 갱신) |

**역할(role) 설명**:
- `user`: 일반 사용자 (글 읽기, 글 작성/수정/삭제 자신의 글만)
- `admin`: 관리자 (모든 기능 + 다른 사용자 글 삭제 가능) [Phase 2]

---

#### posts 테이블

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 포스트 고유 ID (자동 생성) |
| title | TEXT | 포스트 제목 |
| content | TEXT | 포스트 본문 (마크다운 또는 평문) |
| author_id | UUID | 작성자 ID (→ users.id 참조) |
| created_at | TIMESTAMP | 작성 일시 (자동 기록) |
| updated_at | TIMESTAMP | 마지막 수정 일시 (자동 갱신) |

---

#### 테이블 관계

**1:N 관계** (One-to-Many)
```
users (1) ─── posts (N)
  │
  └─ 한 명의 사용자(users)는 여러 개의 글(posts)을 작성할 수 있다
  └─ posts.author_id는 users.id를 참조
  └─ 사용자 삭제 시 해당 글도 함께 삭제 (CASCADE)
```

---

#### 데이터 모델 활용처

**Ch8 (인증)**:
- users 테이블로 Supabase Auth 연동
- 로그인 후 users.name, users.avatar_url 표시

**Ch9 (CRUD)**:
- posts 테이블에 글 작성/수정/삭제
- posts.author_id로 자신의 글만 수정/삭제 가능 (RLS 규칙)

**Ch11 (RLS - Row Level Security)**:
- 사용자는 자신의 글만 수정/삭제 가능
- admin은 모든 글 관리 가능

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
