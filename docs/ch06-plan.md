# B회차 과제 실행 계획서

## 목표
블로그 프론트엔드 과제 4개 기능을 Next.js App Router 구조에서 안정적으로 완성한다.

- 검색 기능
- 작성 폼 유효성 검증
- 삭제 기능
- 서버 데이터 페칭

## 범위
### 포함
- useState + 이벤트 핸들러 기반 상호작용
- 불변성 유지 방식(filter, map, spread)
- JSONPlaceholder 조회(fetch)
- Server Component 기본 유지 + 필요한 부분만 Client Component 분리

### 제외
- 실제 백엔드 CRUD 연동
- 인증, 배포, 알림 등 부가 기능

## 구현 단계
1. 작성 폼 유효성 검증 먼저 완료
- 제목 공백(trim) 검사 추가
- 빈 제목 제출 시 경고 후 제출 중단
- 성공 시 기존 이동 흐름 유지

2. 목록 데이터 구조 정리
- 목록 페이지에서 서버 fetch 기반 초기 데이터 로딩
- 기존 더미 타입 기준으로 API 응답 매핑 규칙 정리
- 로딩/에러/빈 결과 상태 문구 정의

3. 검색 기능 구현
- SearchBar를 Client Component로 분리
- 검색어 상태(useState) 관리
- 제목 기준 filter 적용
- 검색 결과 없음 UI 처리

4. 삭제 기능 구현
- 삭제 버튼 클릭 시 confirm 처리
- 확인 시 filter로 상태 갱신(불변성 유지)
- 우선 목록 페이지 삭제를 기본 범위로 완료

5. 통합 검증
- useState/useEffect가 Client 영역에만 있는지 점검
- 라우팅 규칙 점검(next/navigation 사용)
- 동적 라우트 params await 규칙 유지 확인

## 파일별 작업 포인트
- app/posts/new/page.tsx: 제목 유효성 검증 강화
- app/posts/page.tsx: 서버 데이터 로딩 + 목록 렌더 구조 정리
- app/posts/[id]/page.tsx: 상세 페이지 영향도 점검
- lib/posts.ts: 타입/더미 기준 유지 및 매핑 참조
- components 하위 신규 컴포넌트: SearchBar, 필요 시 목록 상호작용 전용 컴포넌트

## 검증 체크리스트
1. 목록 진입 시 서버 데이터가 렌더된다.
2. 검색 입력 시 결과가 즉시 필터링된다.
3. 작성 페이지에서 제목 공백 제출이 차단된다.
4. 삭제 confirm 이후 해당 항목만 제거된다.
5. next/router 사용 흔적이 없다.
6. 동적 라우트에서 params await 규칙이 유지된다.

## 결정 사항
- 검색 기준: 제목 우선
- 삭제 지속성: 메모리 상태(새로고침 시 초기화)
- 서버 연동 범위: 조회(fetch)까지만 수행
