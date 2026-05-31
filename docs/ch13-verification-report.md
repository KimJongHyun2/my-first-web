# Chapter 13 최종 검증 보고서

## 1. 테스트 환경

- 로컬: Windows + Next.js dev server
- 배포: https://my-first-web-chi-six.vercel.app/
- 테스트 도구: Playwright

## 2. Playwright 테스트 결과

- 로컬 전체 실행: `npm run test:e2e`
- 결과: 2 passed
- 확인한 시나리오
  - 로그인 → 글 작성 → 상세 페이지 확인 → 목록 노출 확인
  - 비로그인 상태에서 `/posts/new` 접근 시 `/login` 리다이렉트
  - 테스트 완료 후 생성한 E2E 글은 자동 삭제하여 목록을 정리함

## 3. 배포 URL 수동/자동 검증 결과

- 배포 URL 접속 확인: 성공
- Chromium 기준 배포 E2E: 성공
- 핵심 시나리오
  - 홈/목록 접속: 성공
  - 로그인: 성공
  - 글 작성: 성공
  - 로그아웃: 성공
  - 비로그인 `/posts/new`: 로그인 이동 확인
  - 다른 사용자 글 수정/삭제: UI 레벨에서는 버튼 숨김, 실제 보안은 RLS가 담당

## 4. 확인 필요한 항목

- 배포 검증은 Chromium 기준으로 완료했고, WebKit 배포 재검증은 확인 필요
- `public.profiles` RLS는 현재 비활성 상태로 보임. Ch13 핵심 범위는 `public.posts` 정책 검증까지 완료했지만, 프로필 테이블을 잠그려면 별도 작업이 필요함

## 5. 결론

Ch13의 핵심 요구사항인 Playwright E2E, 코드리뷰 반영, 배포 URL 검증, 검증 보고서 작성까지 완료했다. 