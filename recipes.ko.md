<!-- sy-source: edc547dd8ed3579b -->
# Synapse recipes

사전 정의된 다중 컴포넌트 조합. 레시피는 고정된 구성입니다: 정확한 타이포그래피 스타일, 스페이싱, 순서. 화면이 이 조합 중 하나를 필요로 할 때, 에이전트는 처음부터 구성하는 대신 레시피를 그대로 사용합니다 — 레시피의 즉흥적 변형은 계약 위반입니다. 여기서 다루지 않는 조합은 `patterns.md` 규칙 아래 `components.md`로 구성합니다. 반복되는 즉흥은 새 레시피로 제안되어야 합니다(`design.md` §6).

각 레시피: 위→아래 / 왼쪽→오른쪽 구조, 타이포그래피 스타일과 스페이싱 토큰 포함.

---

## R1 · 페이지 헤더

모든 Object 및 Workbench 페이지의 최상단 블록.

```
[Breadcrumb]                                    ← only if depth > 2
space-4
[heading-xl page title]  [Badge status, size lg] [actions: ≤1 primary/accent + ≤1 secondary + overflow menu]
space-4
[caption fg.tertiary meta line: owner · updated timestamp · id]
space-24 (focus) / space-16 (dense)
```

타이틀 절단 금지; 긴 타이틀은 줄바꿈합니다. 액션은 오른쪽 정렬, 타이틀 라인에 수직 중앙 정렬. 메타 라인 항목은 "·"로 구분.

## R2 · 섹션 헤더

모든 콘텐츠 섹션이나 데이터 영역 위에 배치.

```
[heading-lg]  [count Badge]                     [≤1 secondary or ghost action]
space-4
[body-sm fg.secondary one-line description]     ← optional
space-16
```

설명은 결코 한 문장을 넘지 않음 — 더 긴 설명은 문서 링크로 이동.

## R3 · 카드 헤더

Card 안: `heading-md`(페이지를 지배하는 카드는 `heading-lg`) + 선택적 후행 ghost 액션 또는 SegmentedControl; 아래에 풀블리드 `border.subtle` 룰; 헤더 패딩 = 카드 패딩.

## R4 · 통계 그리드

동일 열 그리드에 2–6개의 `stat` Card, 거터 `space-16`(dense) / `space-24`(focus).

통계 카드 내부(고정 순서): `label` `fg.secondary` 타이틀 → `stat` 값(그리드에 카드가 ≤3개이면 `stat-lg`; 통계 스타일은 숫자 트래킹 −1%를 지님, v6.4) + 같은 베이스라인 행에 선택적 오른쪽 정렬 **스파크라인**(64×24, 1.5px `viz.1` 스트로크, 필 없음, `aria-hidden`) → **델타 행**(v6.4): 12px `trend-up`/`trend-down` 레지스트리 아이콘 + 12 medium tabular 텍스트, *좋음*의 방향으로 색상 지정(`status.success`/`status.danger`) — 결코 Badge 아님(통계 카드 안의 배지는 상자 안의 상자) → `caption` `fg.tertiary` 비교 기간("vs last week" / "전주 대비").

## R5 · 액션 페어 및 푸터 규약

- 다이얼로그/폼 푸터: 오른쪽 정렬, `[secondary "취소"] [primary confirm]` — confirm은 항상 가장 오른쪽, 간격 `space-8`. 파괴적: `[secondary "취소"] [danger confirm]`.
- 페이지 수준 폼: 같은 페어를 섹션 하단에 고정, 섹션이 하나뿐일 때는 floating-sticky로 두지 않음.
- 인접한 primary 두 개 금지; 세 번째 액션은 가장 왼쪽의 `ghost`("편집")가 되거나 오버플로 메뉴로 들어감.

## R6 · 필터 바

모든 필터 가능한 데이터 영역 위에:

```
[search Input, max 320px] [filter Combobox/Select ×≤3] [DatePicker range] ··· [ghost "Clear" — only when ≥1 filter active] [right: view SegmentedControl / column menu]
```

단일 행, 간격 `space-8`, 좁은 뷰포트에서 줄바꿈(검색이 먼저 전체 폭). 활성 필터는 인라인에 맞지 않을 때 둘째 행에 제거 가능한 입력 Chip으로 렌더링됩니다. "해제"는 전부 제거하며, 결코 숨기지 않습니다.

## R7 · 툴바

밀집 워크벤치 컨트롤 스트립: 높이 40px, 항목 간격 `space-8`, 그룹은 양쪽에 `space-12`를 둔 전체 높이 1px `border.subtle` 디바이더로 구분. 승인된 목록의 아이콘 버튼; 텍스트 버튼은 `ghost`/`secondary` sm. 최대 3그룹; 오버플로는 ⋯ 메뉴로.

## R8 · 폼 섹션

```
[heading-md]  +  optional [body-sm fg.secondary description]
space-16
[fields, stack-gap]                              ← single column, patterns.md §3
space-24
```

필드 3–6개마다 새 섹션. 긴 폼에서 섹션은 풀블리드 `border.subtle` + `space-24`로 구분.

## R9 · 스테퍼

Guided 아키타입을 위한 순차 흐름 지시자(컴포넌트가 아니라 구성됨). **숫자 규율(v6.24):** 스텝 번호는 `600 11px/1` tabular — 20px 원 안에서 line-height 1은 필수(상속된 line-height는 숫자를 아래로 앉힘); 링은 **1.5px**(2px는 11px 숫자를 압도; 1.5는 AgentStep의 pending-dot 링과 맞음):

```
[step dot/number 20px] — [label label-role] — [connector 1px border.default line] — …
```

상태: done(키 색상 필 + 체크), current(키 색상 링 + `fg.primary` 레이블), upcoming(`border.strong` 링 + `fg.tertiary` 레이블). 컴팩트 변형: "2/4" `label` `fg.tertiary` + 4점 행. 가로는 ≤5스텝; 온보딩 체크리스트에는 설명이 있는 세로형.

## R10 · 톱바

앱 프레임 최상단 스트립(제품 표면이 Sidebar 외에 하나 더 필요할 때): 높이 48px, `bg.surface`, 풀블리드 하단 `border.subtle`. 왼쪽: 컨텍스트(워크스페이스 스위처 — ghost Button: **20px 각진 모노그램 타일**(`bg.inverse` 필, `fg.inverse` 글자, 래디우스 `xs` — 프레임의 유일한 의도적 어두운 오브젝트, v6.7) + 워크스페이스 이름 + 셰브런). 가운데: 없음(검색은 ⌘K에 있음). 오른쪽: 솔리드 Banner 슬롯(시스템 위급 전용)은 결코 여기 없음 — 톱바 *위*에 고정됨; 그다음 알림 벨(아이콘 버튼 + count Badge), 도움말, Avatar 32 메뉴.

## R11 · 키-값 패널

Object 요약 블록: Card(`flat` 기본, 분리 가능한 오브젝트로 읽혀야 할 때 `outlined`) + DescriptionList `side-by-side`, `heading-sm` 타이틀 아래 ≤10행마다 그룹핑; 행 hover 시 복사/편집 ghost 액션을 드러냄. 표준 행 순서: 아이덴티티(이름, ID) → 상태(status Badge, 소유자) → 타임스탬프(생성, 수정) → 구성.

## R12 · 빈 페이지 (최초 실행)

전체 콘텐츠 영역 EmptyState, Guided 스타일링: `display` 스타일 타이틀 허용, `body-lg` 설명(≤2문장), 하나의 primary 액션(여기서는 필 실루엣 승인됨 — Button 스펙 v5.0) + 선택적 ghost "Learn more" 링크, 다단계 설정을 위한 선택적 Stepper(세로형)를 아래에. 페이지에 다른 콘텐츠 없음 — 여백을 채우려는 유혹을 견디십시오.

## R13 · 오류 페이지 (403 / 404 / 500)

페이지 배경 위의 전체 콘텐츠 영역 EmptyState, focus 밀도: 48px 원 안의 오류 아이콘 · `heading-md` 타이틀 · 한 문장 `body` 설명 · 하나의 액션.

- **403**: "You don't have access to this page" / "이 페이지에 접근할 권한이 없습니다" + 권한 인지 사유 규칙(patterns §6) + "Go to home" secondary. 페이지에 무엇이 있는지 결코 드러내지 마십시오.
- **404**: "This page doesn't exist" / "존재하지 않는 페이지입니다" — 삭제되었을 가능성이 큰 오브젝트는 오브젝트별 not-found 카피(content.md §5) + "Go back" secondary를 받음.
- **500**: 오류 성격 + Retry primary + 지원용 `code-sm`의 인시던트 참조. 셸이 정상인 한 크롬(사이드바)은 렌더링을 유지함 — 오류는 콘텐츠 영역 이벤트입니다.

## R14 · 내보낸 보고서 (인쇄 / PDF)

에이전트가 생성한 보고서는 앱을 떠납니다. 내보내기는 상호작용이 없는 Synapse 표면입니다.

- A4 세로, 20mm 여백; 헤더: 워크스페이스 이름 + 보고서 타이틀(`heading-lg` 상당) · 푸터: 생성 타임스탬프 + "{n}/{m}" 페이지 번호, content.md §6에 따른 두 로케일의 날짜 형식.
- 타이포그래피는 px→pt를 0.75로 매핑(body 14px → 10.5pt); 디스플레이 패밀리는 내보내기에서 사용되지 않음(브랜드 모먼트가 아니라 문서); ID용 mono는 유지됨.
- 차트는 직접 시리즈 레이블과 함께 정적으로 렌더링됨(기댈 툴팁 없음); 상태는 항상 아이콘 + 텍스트(인쇄는 그레이스케일일 수 있음 — 색상이 유일한 채널일 수 없으며, 아이콘 포함 Badge 변형이 이를 제공).
- SourceChip은 인용된 페이지에서 번호가 매겨진 각주로 변환되고, 전체 소스 목록은 문서 끝에.
- 페이지 나눔 규칙: 테이블 행, 통계 카드, 헤딩+첫 문단 쌍의 내부에서는 절대 나누지 않음; 테이블은 페이지마다 헤더 행을 반복함.
- 내보내기에서는 상호작용 컴포넌트가 렌더링되지 않음: 버튼, 입력, 툴바는 비활성화가 아니라 생략됨.

## R15 · 일괄 실행 결과 (v6.47)

큐(ai-patterns §29) 완료는 여기로 도착합니다: Table, 입력 항목당 한 행 — mono 소스 이름 · 상태(점+텍스트) · 개수/지표 열(tabular) · 행별 열기 링크; 실패한 행은 다시 시도를 인라인으로 유지. 헤더는 집계 라인과 결과 내보내기(`secondary`)를 담음. Empty/전부 실패는 표준 오류 EmptyState를 사용. 관할: Workbench 아키타입.
