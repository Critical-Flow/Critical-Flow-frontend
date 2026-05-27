# 기능 요약

각 페이지에 박혀있던 하드코딩 데이터를 제거하고, 1·2단계에서 만든 서비스 레이어(`services/*`)와 `useFetch` 훅을 통해 데이터를 받아오도록 연결했습니다.
백엔드 연결 시 페이지 컴포넌트는 수정 없이 동작하는 구조가 목표입니다.

## 상세 설명

### 라우트 변경

- `/editor` → `/editor/:noteId` (신규 노트는 `/editor/new`)
- `/quiz` → `/quiz/:noteId`

### 페이지별 변경

- **Dashboard**: 하드코딩 KPI·바차트·도넛차트 제거 → `useFetch(getStats)`
- **Directory**: 하드코딩 `notes`/`folders`/`tags` 제거 → `useFetch` 3개, 검색 input에 `useDebounce(300ms)` 적용, 작성일에 `formatRelativeTime()` 적용
- **Editor**: `INITIAL_MD` 상수 제거 → `useParams`로 `noteId` 추출 후 `getNote()`로 로드, 저장 버튼은 `saveNote()` 호출, IoT 학습 버튼은 `startSession()`/`endSession()` 호출, 좌측 사이드바는 `getFolders()` 결과 표시
- **Quiz**: 하드코딩 문제 제거 → `useFetch(generateQuiz)`로 문제 로드, 보기 클릭 시 `submitAnswer()`로 정답 검증, 이전/다음 버튼 동작 연결
- **Create**: 생성 버튼 `alert()` 제거 → `startSession()` 호출 후 응답받은 `sessionId`로 `/editor/:id` 이동, 생성 중 버튼 비활성화

### 컴포넌트 변경

- **Sidebar**: `"김영남"` 하드코딩 → `useAuth().user?.name`
- **MyPageModal**: 유저 정보·GitHub 계정·호칭 하드코딩 → `useAuth()` 연동, 로그아웃 버튼에 실제 `logout()` + `navigate('/')` 연결

### 부가 수정

- **DirectoryEmpty**: 라우트 변경으로 깨진 `to="/editor"` 링크를 `/editor/new`로 수정

## 참고 자료

- `stage3-plan.md` — 본 단계 설계 문서 (로컬, `.gitignore` 처리됨)
- 1단계 PR: 공통 인프라 구축 (utils, hooks, 공통 컴포넌트)
- 2단계 PR (#5): API 서비스 레이어 구축

## 테스트 방법

- `/dashboard` 접근 시 로딩 후 KPI 4개·요일별 바차트·주제별 도넛차트 정상 렌더
- `/directory` 접근 시 노트 12개 표시, 폴더 클릭 시 필터링 동작, 검색창 입력 후 300ms 뒤 필터링 반영
- `/editor/1` 접근 시 노트 본문이 로드되어 에디터에 표시, 저장 버튼 클릭 시 알림 표시
- `/editor/new` 접근 시 빈 에디터로 진입
- `/quiz/1` 접근 시 문제 표시, 보기 클릭 시 정답/오답 피드백 표시
- `/create` 에서 생성 후 `/editor/:id`로 자동 이동
- 마이페이지 모달에서 로그아웃 시 `/`로 리다이렉트

## 체크리스트

- [x]  빌드 통과 (`npm run build`)
- [ ]  코드 리뷰
- [ ]  UI 동작 확인