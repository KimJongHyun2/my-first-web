# TODO — my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] ARCHITECTURE.md 작성
- [x] copilot-instructions.md 작성
- [x] shadcn/ui 초기화 + 테마 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지
- [x] shadcn/ui 초기화 (npx shadcn init)
- [x] 핵심 컴포넌트 추가 (Button, Card, Input, Dialog)
- [x] 테마 커스터마이징 (globals.css 색상 변수)
- [x] ARCHITECTURE.md 페이지 맵/유저 플로우 작성
- [x] 와이어프레임 스케치 (3개 페이지)
- [x] 디자인 프롬프트 전략 학습 (7.7) — Design Strategy + DESIGN_PROMPTS.md
- [x] Component Hierarchy 작성 (7.8.2) — shadcn/ui 컴포넌트 기준
- [x] Data Model 설계 (7.8.1) — users/posts 테이블 + SQL
- [x] Validation Checklist 작성 (7.8.3) — 10가지 검증 항목
- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 작성

## 2단계: 핵심 기능 (Ch9~10)

### Ch9: Auth ✓
- [x] Auth Context 생성 (contexts/AuthContext.tsx)
- [x] 로그인 페이지 (app/login/page.tsx)
- [x] 회원가입 페이지 (app/signup/page.tsx)
- [x] Middleware 설정 (middleware.ts)
- [x] 보호 라우트 구현

### Ch10: CRUD
- [x] lib/posts.ts: createPost, readPosts, readPostById, updatePost, deletePost
- [x] 포스트 목록 페이지 (readPosts)
- [x] 포스트 상세 페이지 (readPostById + 작성자 버튼)
- [x] 포스트 작성 페이지 (createPost)
- [x] 포스트 수정 페이지 (updatePost)
- [x] 포스트 삭제 기능 (deletePost + Dialog 확인)
- [x] 빌드/배포 검증 (npm run build, 민감한 정보 노출 확인)

## 3단계: 고급 기능 (Ch11~12)

### Ch11: RLS (Row Level Security) ✅
- [x] 권한 시나리오 자연어 작성
- [x] RLS SQL 생성 (4개 정책: SELECT, INSERT, UPDATE, DELETE)
- [x] Supabase CLI 마이그레이션 생성 (npx supabase migration new add_posts_rls)
- [x] 마이그레이션 적용 (npx supabase db push)
- [x] 비로그인/다른 사용자 우회 테스트
- [x] 민감 키 노출 검사 (grep)
- [x] 빌드/배포 검증 (npm run build)
- [x] 문서 최종 업데이트 (context.md, ARCHITECTURE.md, copilot-instructions.md)

### Ch12: 추가 기능 (완료)
- [x] 에러 처리 및 로딩 UX 추가 (`app/error.tsx`, `app/loading.tsx`)
- [x] 게시글 로딩 스켈레톤 추가 (`app/posts/loading.tsx`, `app/posts/[id]/loading.tsx`)
- [x] 게시글 작성 폼 클라이언트 검증 추가 (제목 최소 2자, 내용 최소 10자)
- [x] 에러 메시지 변환 유틸 추가 (`lib/error-message.ts`) 및 로그인/회원가입에 적용
- [ ] 마이페이지
- [ ] 댓글 기능

## 4단계: AI 결과물 검증 (Ch13)

- [x] Playwright E2E 테스트 2개 작성
- [x] 로컬 E2E 실행 및 수정
- [x] 코드리뷰 관점 점검 및 수정
- [x] Vercel 배포 URL 검증
- [x] 최종 검증 보고서 작성

## 진행률: 4단계 완료 — Ch13 검증 완료!