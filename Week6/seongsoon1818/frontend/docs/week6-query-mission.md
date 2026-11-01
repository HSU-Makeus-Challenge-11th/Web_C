# 6주차 필수 미션 — TanStack Query

검증일: 2026-11-01 (한국 시간)

## 구현 위치

| 파일 | 내용 |
| --- | --- |
| [main.tsx](../src/main.tsx) | 앱 전체에서 QueryClient 하나 공유, staleTime 1분, gcTime 5분, 개발 환경의 Query Devtools |
| [movieListPage.tsx](../src/pages/movies/movieListPage.tsx) | useQuery 목록 조회, page별 캐시, adapter와 카드·페이지네이션 연결 |
| [searchPage.tsx](../src/pages/movies/searchPage.tsx) | 검색어·page별 useQuery, 빈 검색어 요청 차단, 검색 폼·결과 표시 |
| [movieDetailPage.tsx](../src/pages/movies/movieDetailPage.tsx) | 영화 ID별 useQuery, ID 검사, 상세 UI, 404 안내 |

이번 보완에서 main.tsx에 gcTime과 캐시 시간의 의미를 명시하고, README를 6주차 기준으로 갱신했습니다.
이 문서와 [실제 요청 검증 기록](week6-cache-verification.json)을 추가했습니다.

## 요청이 구분되는 key

```ts
["movies", "list", { page }]
["movies", "search", { query: normalizedQuery, page }]
["movies", "detail", movieId]
```

목록·검색·상세는 종류가 달라 서로 다른 캐시를 사용합니다.
같은 종류 안에서도 page, 검색어, 영화 ID가 다르면 별도의 캐시를 사용합니다.
Devtools에서는 객체 속성 순서가 정렬되어 표시될 수 있습니다. 속성의 값이 같다면 같은 query key입니다.

## 화면 상태

| 조건 | 표시·동작 |
| --- | --- |
| 첫 요청 로딩 | 기존 로딩 안내 |
| 요청 오류 | 오류 문구와 다시 시도 버튼, refetch로 같은 조건 재요청 |
| 목록·검색 성공 후 빈 results | 빈 결과 안내 |
| 정상 결과 | 카드·검색 결과·상세 정보 표시 |
| 빈 검색어 | 검색 안내, enabled=false |
| 올바르지 않은 영화 ID | 잘못된 ID 안내, enabled=false |
| 상세 404 | “영화를 찾을 수 없어요.” |
| stale 캐시를 가진 화면 재방문 | 캐시로 화면을 표시하면서 백그라운드 갱신 |

상태 표시·잘못된 입력·재시도·북마크 등은 모의 API 브라우저 검증 12개 항목에서 확인했습니다.

## Query Devtools + Network에서 직접 확인

1. `pnpm dev`를 실행하고 터미널의 로컬 주소로 접속합니다.
2. 화면 구석의 TanStack Query 아이콘을 눌러 Query 개발자 도구를 엽니다.
3. 브라우저 F12 → Network → Fetch/XHR를 선택하고, 필요하면 `api.themoviedb.org`로 필터링합니다.
4. 목록을 처음 열면 `movie/popular` 요청과 목록 query key가 생성됩니다.
5. 영화 카드를 열면 `movie/{id}` 요청과 상세 query key가 추가됩니다.
6. 1분 안에 브라우저 뒤로가기로 목록에 돌아옵니다. 목록 캐시는 재사용되고 같은 목록 GET 요청이 추가되지 않습니다.
7. 다시 앞으로 가면 상세 캐시도 재사용됩니다.
8. 검색어를 제출하고 1페이지 → 2페이지 → 뒤로가기를 해 봅니다. page별 캐시가 구분되며, 돌아온 1페이지는 재사용됩니다.
9. 1분이 지난 뒤 다른 화면을 거쳐 돌아오면 stale 데이터를 먼저 보여 주면서 재조회할 수 있습니다.

Query 개발자 도구에서는 key, Fresh·Fetching·Stale·Inactive 상태 및 각 query의 데이터를 볼 수 있습니다.
Network의 Disable cache는 HTTP 캐시에 대한 설정이며 TanStack Query의 메모리 캐시를 비우지 않습니다.
새로고침은 새 앱 인스턴스를 만들기 때문에 기본 메모리 캐시가 초기화됩니다.

`staleTime`은 주기적인 요청 간격이 아닙니다.
`gcTime`은 해당 query가 사용되지 않는 inactive 상태가 된 뒤의 보관 시간입니다.
기본 자동 재시도가 적용된 오류 요청은 Network에 여러 번 나타날 수 있습니다.

## 실제 TMDB 검증 결과

브라우저의 Query Devtools UI와 CDP Network 이벤트를 함께 확인했습니다.
HTTP 캐시는 비활성화했으며 인증 값은 검증 기록에 포함하지 않았습니다.
stale·gc 시간 검증은 브라우저 가상 시계를 진행시켜 재현했습니다.

| 동작 | 추가 API GET 요청 |
| --- | --- |
| 목록 최초 방문 | 1회, HTTP 200 |
| 상세 최초 방문 | 1회, HTTP 200 |
| 상세 → 목록 재방문 (fresh) | 0회 |
| 목록 → 상세 재방문 (fresh) | 0회 |
| 목록 2페이지 최초 방문 | 1회, HTTP 200 |
| 검색 love 1페이지·2페이지 최초 방문 | 각각 1회, HTTP 200 |
| 검색 2페이지 → 1페이지 복귀 (fresh) | 0회 |
| 시간만 1분 진행 | 0회, stale 상태 전환 |
| stale 목록 재방문 | 1회, 캐시 표시 후 갱신 |
| inactive 상태로 5분 경과 | 0회, 사용하지 않는 캐시 제거 |
| 브라우저 새로고침 | 1회, 메모리 캐시 새로 생성 |

실제 API GET은 총 7회였으며, 캐시 흐름 검증 10개 항목이 통과했습니다.
Query Devtools에서 목록 1·2페이지, 상세 ID 155, 검색 love 1·2페이지의 독립 캐시를 확인했습니다.
현재 사용 중인 목록 캐시는 gcTime이 지나도 제거되지 않는 것도 확인했습니다.

- `pnpm build`: 통과
- `pnpm lint`: 통과
- 실제 캐시 검증의 Console 오류·미처리 JavaScript 오류: 0건

참고: [TanStack Query 기본 동작](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults), [Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)
