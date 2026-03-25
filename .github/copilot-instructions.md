# Copilot Instructions

## Tech Stack
- Next.js: 16.2.1
- Tailwind CSS: ^4
- Routing: App Router ONLY (`app/` 기반)

## Coding Conventions
- 기본은 Server Component로 작성한다.
- 스타일링은 Tailwind CSS만 사용한다.

## Known AI Mistakes (금지/주의)
- `next/router` 사용 금지, 반드시 `next/navigation` 사용.
- Pages Router(`pages/`) 패턴 사용 금지.
- 동적 라우트 `params`는 반드시 `await`해서 사용한다.
