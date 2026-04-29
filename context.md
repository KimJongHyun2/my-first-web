# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-04-29
- 완료된 작업: **Ch7 완전 완료** — 페이지 맵, 유저 플로우, 와이어프레임, 디자인 전략, 데이터 모델
- 다음: Ch8 Supabase 연동 (테이블 생성, 인증 설정)
- 미착수: CRUD 구현, 로그인/회원가입

## 기술 결정 사항

- 인증: Supabase Auth (Email)
- 상태관리: React Context (AuthProvider)
- 이미지: Supabase Storage 사용 예정

## 변경된 파일

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