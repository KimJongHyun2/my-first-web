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

- [ ] 마이페이지
- [ ] 댓글 기능

## 진행률: 2단계 완료 (26/29) ✨