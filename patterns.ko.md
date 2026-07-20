<!-- sy-source: 4bb2635c550cb925 -->
# Synapse 패턴

컴포넌트가 어떻게 페이지로 조합되는지를 다룹니다. 이 계층이 에이전트가 생성한 화면을 컴포넌트 더미가 아니라 *AgentOS처럼 보이게* 만듭니다. 페이지 아키타입이 주된 결정 메커니즘입니다: 모든 새 화면은 레이아웃 작업 전에 정확히 하나의 아키타입으로 분류되어야 합니다. 아키타입이 밀도 모드, 레이아웃 그리드, 허용된 영역을 고정하기 때문입니다.

---

## 1. 페이지 아키타입

### 결정 규칙

```
Is the page's job to display many records or live metrics at once?
├── yes → WORKBENCH (dense)
└── no
    ├── Is it a single object's detail or editing view? → OBJECT (focus, may embed dense regions)
    ├── Is it configuration, preferences, or account? → SETTINGS (focus)
    ├── Is it a first-run, wizard, or decision moment? → GUIDED (focus)
    ├── Is it conversation with an agent? → CONSOLE (focus, own layout)
    └── Is it the workspace's start/today surface? → HOME (focus, composer pinned)
```

### A. Workbench — dense

데이터 테이블, 대시보드, 모니터링, 대기열, 로그.

- `data-density="dense"`, 유동 너비, `--sy-page-padding` 24.
- 위에서 아래로의 구조: **툴바 행**(페이지 제목 24/34 왼쪽; 필터, 검색 Input, 주 행동 오른쪽; 높이 40, 단일 행) → 선택적 **메트릭 스트립**(그리드의 stat Card 2–6개, dense 패딩) → **데이터 영역**(Table, 또는 시각적 레코드용 Card 그리드) → Pagination.
- 차트는 16-semibold 헤더와 각각 하나의 차트가 있는 Card에 삽니다; `viz` 팔레트는 고정 순서로; 대시보드 뷰당 최대 4개의 메트릭 색상.
- 다중 패널 워크벤치(목록 + 상세)는 SplitPanel(기본 40/60)을 사용합니다; 상세 페인은 인라인 OBJECT 영역(focus)입니다 — 이것이 승인된 혼합 밀도 사례이며, 경계 = 분할선.

### B. Object — focus

하나의 엔티티(프로젝트, 에이전트 실행, 문서)의 상세 뷰.

- `data-density="focus"`; 콘텐츠 최대 너비 `--sy-content-max`(760px) 중앙 정렬, 단 dense 자식 테이블을 임베드할 때는 1200px까지 확장할 수 있습니다.
- 구조: Breadcrumb → **헤더 블록**(제목 24/34, Badge + `fg.tertiary` 타임스탬프의 메타 줄, 행동 오른쪽: 최대 primary + secondary + 오버플로 메뉴) → Tabs(객체에 패싯이 있으면) → 쌓인 콘텐츠 섹션(`--sy-section-gap`).
- Object 페이지 내부의 관련 레코드는 임베드된 dense Table 영역으로 렌더링됩니다 — 가시적 컨테이너 경계(Card 프레임)와 함께.

### C. Settings — focus

- 최대 너비 760px. 3개를 초과하는 섹션에는 왼쪽 앵커 섹션 목록(Sidebar 레벨 2 또는 Tabs).
- 각 섹션 = 헤더가 있는 Card; 행은 레이블+컨트롤 쌍입니다: 레이블 + 캡션 설명 왼쪽, 컨트롤 오른쪽, `border.subtle` 행 분할선. 즉시 효력 행은 Switch를 사용; 폼 스타일 섹션은 오른쪽 정렬 Save(primary) + Cancel로 끝납니다.
- Card당 하나의 Save. 절대 전역 고정 저장 바와 카드별 저장을 동시에 두지 마세요.

### D. Guided — focus

온보딩, 마법사, 빈 첫 실행, 되돌릴 수 없는 결정. Display 타입(30/40, 36/48)과 `lg` 버튼이 허용되는 유일한 아키타입입니다.

- 단일 중앙 열, 최대 너비 560px, 넉넉한 `--sy-space-64` 상단 오프셋.
- 다단계 흐름: 스텝 표시자(13 medium, `fg.tertiary` "2/4" 또는 점 행 — 프리미티브로 구성된, 승인된 "스테퍼"), 스텝당 하나의 결정, 주 계속 + ghost 뒤로.

### E. Console — focus

에이전트 대화 표면.

- 투컬럼: 대화(유동, 최대 너비 760 메시지 열) + 선택적 컨텍스트 Drawer.
- 메시지: 사람 메시지는 오른쪽 앵커 `bg.sunken` 버블(반경 `lg`); 에이전트 메시지는 `bg.page` 위 전체 폭 평문 — 에이전트는 제품으로서 말하고, 사람은 버블로 말합니다.
- 에이전트 정체성은 사각형 Avatar를 사용합니다. 스트리밍, 작업 스텝, 승인, 출처, 실패 관례는 `ai-patterns.md`가 규율합니다 — Console 아키타입이 그 패턴 대부분이 사는 곳이지만, 어떤 아키타입의 모든 AI 표면에도 적용됩니다.

---

### F. Home — focus (v6.39)

워크스페이스의 시작 표면: 오늘의 상태와 대화형 진입.

- `data-density="focus"`; 콘텐츠 최대 너비 760이 전체 영역 스크롤러 안에 중앙 정렬(스크롤바는 영역 가장자리에); **Composer는 하단에 고정** — 스레드가 없는 Console의 composer 구조. 전송하면 Console 대화가 열립니다.
- 위에서 아래로의 구조: **인사 블록**(화면의 유일하게 승인된 Display 순간 — `display-sm`, display 계열 사용 가능; 아래에 날짜 + 오늘 요약 `caption`) → **메트릭 스트립**(R4, ≤3 카드, 균일 — v6.40 이후 강조 카드 없음; 긴급함은 카드 틴트가 아니라 아래 승인 대기열에 삶) → **승인 대기열**(대기 중인 ProposalCard — 사람 개입 백로그가 다른 어디보다 먼저 여기 표면화; >2일 때 "모두 보기" Link) → **에이전트 선반**(상호작용 Card: 사각형 Avatar, 이름, 상태 점 + 예약 캡션; 클릭하면 에이전트 열림).
- 제안 칩은 여기서 승인되지 않습니다(Console/빈 상태 전용); composer 플레이스홀더가 초대를 전달합니다.
- **하나의 뷰포트, 페이지 스크롤 없음(v6.39.1):** Home은 항상 창에 맞습니다 — ≤3 균일 메트릭 카드(`stat-sm` 숫자, 16 카드 패딩 — Home은 R4 메트릭을 압축), ≤2 대기 제안(그다음 "모두 보기"), 하나의 선반 행, 16px 섹션 간격. 콘텐츠가 넘칠 것 같으면 콘텐츠를 잘라내세요 — 절대 스크롤하지 말고, Composer를 뷰 밖으로 밀지 마세요.
- 빈 유형: 첫 실행 Home은 GUIDED 아키타입으로 인계합니다; 대기 중인 것이 없는 Home도 여전히 인사 + composer를 표시합니다 — 절대 "작업 없음"에 대한 EmptyState 카드가 아님.

## 2. 레이아웃 그리드

- 앱 프레임: Sidebar(240/64) + 주 영역. 주 영역은 하나의 아키타입을 담습니다. **스크롤 컨테이너는 영역을 가로지릅니다(v6.17.5):** 콘텐츠가 더 넓은 영역 안의 중앙 정렬 읽기 열일 때(Console 스레드, focus 문서), 스크롤 컨테이너는 전체 폭 영역이고 열은 그 안에 중앙 정렬됩니다 — 스크롤바는 영역의 가장자리에 앉으며, 절대 열 옆이 아닙니다. 캔버스 중앙의 스크롤바는 깨진 레이아웃으로 읽힙니다.

**앱 크롬은 밀도 독립적입니다(v6.2.5):** Topbar(R10)와 Sidebar는 항상 focus 메트릭으로 렌더링됩니다 — 페이지 밀도는 콘텐츠 영역을 규율하지, 그 주위의 프레임을 규율하지 않습니다(밀도 전환 크롬은 같은 앱을 페이지마다 다르게 느껴지게 함).
- 콘텐츠 그리드는 `--sy-space-16`(dense) / `--sy-space-24`(focus) 거터로 CSS 그리드를 사용합니다. 열 수: 메트릭 카드 2–6; 카드 그리드 2–4; 절대 12열 장식 그리드 안 됨.
- 브레이크포인트: <768 단일 열 + 접힌 사이드바; 768–1280 표준; >1440 워크벤치는 유동 유지, focus 아키타입은 최대 너비 유지(여백은 의도적임 — 채우지 마세요).

### 2.1 좁은 창 계약(v6.1 — 웹 전용; 브라우저 창은 좁아지고, 기기는 존재하지 않음)

- **Sidebar**는 1024 미만에서 64px 아이콘 레일로 접힙니다; 768 미만에서 레일은 topbar 영역의 `menu` 아이콘 뒤에 숨습니다. 레이블은 레일의 Tooltip으로 이동합니다.
- **워크벤치 테이블**은 첫 열을 고정한 채 가로로 스크롤됩니다 — 뷰별 카드 매핑이 명시적으로 스펙되지 않았다면 절대 카드 목록으로 축소되지 않습니다(스펙되지 않은 축소는 새 레이아웃을 지어냄).
- **SplitPanel**: 두 페인이 모두 최소 너비를 충족할 수 없을 때, 보조 페인은 행에서 열리는 Drawer가 됩니다 — 두 개의 쓸모없는 페인을 만드는 대신 분할선이 사라집니다.
- **필터 바(R6)**는 자체 규칙에 따라 감쌉니다; **stat 그리드(R4)**는 열을 6→3→2로 떨어뜨리며, 절대 2 미만으로 안 감; **페이지 헤더(R1)**는 제목을 절대 자르기 전에 제목 줄 아래로 행동을 감쌉니다.
- **Modal**은 `min(90vw, spec width)`로 고정; Drawer는 `min(90vw, 480/640/800)`으로.
- 호버 의존 어포던스(행 행동, HoverCard, ResponseToolbar)는 모든 너비에서 키보드 포커스로 도달 가능한 상태를 유지해야 합니다 — 좁은 창은 레이아웃을 바꾸지, 절대 기능을 바꾸지 않습니다.

## 3. 폼

- 항상 단일 열. 2열 필드 레이아웃은 금지됩니다(KO/EN 레이블 분기 + 스캔 비용).
- 필드 순서: 필수가 선택보다 먼저; 가장 위험한 것이 마지막. 3–6개 필드마다 16-semibold 하위 섹션 헤더로 그룹화.
- 필드 너비는 예상 콘텐츠를 신호합니다: 전체(기본), 단 명백히 짧은 필드(날짜, 코드)는 자연스러운 너비로 제한 — 레이블 컨테이너의 고정 너비가 아니라 필드의 max-width를 통해.
- 검증: 인라인, 형식 오류는 blur 시, 완전성은 제출 시; 오류 요약 Banner는 오류가 3개를 초과할 때만 상단에, 필드로 링크.
- 파괴적이거나 되돌릴 수 없는 제출은 `danger` Button과 결과를 명명하는 카피가 있는 Modal로 확인합니다("This deletes 14 runs permanently" / "실행 기록 14개가 영구 삭제됩니다").

## 4. 데이터 표시 선택

```
Records with comparable fields        → Table
Visual/preview-led records           → Card grid (2–4 col)
Single figure + trend                → Stat card (label 13 medium fg.secondary,
                                        value 24 semibold tabular-nums, delta Badge)
Trends over time                     → line chart · Composition → stacked bar
Distribution                         → bar/histogram · NEVER pie beyond 3 slices
Live status of many systems          → Table with Badge column, not a tile wall
```

모든 차트는 Chart 컴포넌트(`components.md`)를 통해 렌더링됩니다 — 닫힌 타입 집합, 축/범례/툴팁 구조, 로딩/빈/오류 상태가 거기 명시되어 있습니다. 차트의 기간 전환기는 SegmentedControl을 사용합니다.

## 5. 피드백 결정 트리

```
Outcome of a user/agent action, no decision needed → Toast
Validation problem on a field                      → inline field error
Condition affecting a whole page/section           → Banner
Blocking decision or confirmation                  → Modal
Progress, shape known                              → Skeleton
Progress, inside a control                         → Spinner in Button
```

### 5.1 로딩 오케스트레이션(v6.1)

- 페이지 수준 로드 순서는 고정입니다: 크롬(사이드바/topbar)이 즉시 렌더링 → 헤더 블록 스켈레톤 → 콘텐츠 영역 스켈레톤. 크롬은 절대 스켈레톤 안 함.
- **한 번에 하나의 주 스켈레톤 영역** — 사용자가 온 그 영역; 보조 패널은 주 영역이 해결될 때까지 아무것도 표시하지 않고, 그다음 여전히 대기 중이면 스켈레톤.
- 스켈레톤은 세 가지 프리셋(line/block/circle)만 구성합니다; 테이블 스켈레톤은 예상 행 수를 렌더링하되 10개로 제한; 차트 스켈레톤은 타입의 실루엣.
- 300ms 미만에서는 아무것도 렌더링 안 함(기존 규칙); 절대 한 영역에서 Spinner와 Skeleton을 섞지 마세요; 로드 중간에 실패한 영역은 스켈레톤을 오류 EmptyState로 바꾸며, 절대 맥동하는 시체를 남기지 않습니다.

### 5.2 낙관적 대 비관적 변경(v6.1)

- **낙관적**(결과를 즉시 렌더링하고 백그라운드에서 조정): 로컬, 되돌릴 수 있는, 단일 사용자 메타데이터 — 이름 변경, Switch 토글, Chip이나 태그 추가/제거, 읽음 표시, 재정렬. 실패 시: 가시적으로 되돌리고 + 무엇이 실패했는지 명명하는 danger Toast("Rename didn't save — check your connection." / "이름 변경이 저장되지 않았습니다 — 연결을 확인하세요.").
- **비관적**(확인될 때까지 스피너/비활성화): 에이전트가 실행하는 모든 것, 파괴적인 모든 것, 다른 사용자나 권한에 영향을 주는 모든 것, 명명된 결과가 있는 모든 것. ProposalCard 승인은 항상 비관적입니다 — 조용히 실패한 승인은 제품에서 최악의 상태입니다.
- 에이전트 출력이나 실행 상태를 절대 낙관적으로 렌더링하지 마세요; 에이전트는 보고하지, 예측되지 않습니다.

## 6. 권한 인식 렌더링(v5.1)

하나의 규칙이 가시적-비활성화 대 숨김을 결정합니다:

- **비활성화 + 이유**: 사용자가 조직 내에서 그 기능을 개연성 있게 얻을 수 있을 때 — 요구사항을 명명하는 Tooltip과 함께 컨트롤을 비활성화로 렌더링("Requires editor access — ask your admin" / "편집자 권한이 필요합니다 — 관리자에게 요청하세요"). 발견 가능성은 기능입니다.
- **완전히 숨김**: 기능이 플랜 게이트되었거나, 조직이 비활성화했거나, 사용자의 역할 표면과 무관할 때: 부재한 기능은 죽은 크롬으로 광고되지 않습니다.
- 권한 이유로 클릭 시 오류가 나는 실행 가능한 컨트롤을 절대 렌더링하지 마세요 — 권한은 행동 시점이 아니라 렌더링 시점에 해결됩니다.
- 목록/테이블에서 사용자가 작용할 수 없는 행도 여전히 *표시*됩니다(데이터 가시성 ≠ 행동 권한); 그들의 행동 셀만 비활성화됩니다.
- 생성 에이전트는 화면을 구성하기 전에 뷰어의 권한 컨텍스트를 반드시 받아야 합니다(화면 의도 스키마가 `permissions` 필드를 지님) — 그것 없이 생성된 화면은 검토 불가능합니다.

## 7. 이중 언어 레이아웃 패턴

- 가로 여유를 예약하세요: 텍스트와 컨트롤을 짝짓는 모든 행은 컨트롤을 감싸지 않고 KO/EN의 더 넓은 문자열(+25%)을 견뎌야 합니다.
- 날짜/숫자 형식은 레이아웃 선택이 아니라 로케일 토큰입니다: EN `Jan 9, 2026` / KO `2026년 1월 9일`; 둘 다 테이블에서 tabular-nums 사용. 시간 상대 형식은 호버 시 절대 표기가 있을 때만 허용.
- 변수 주위에 연결된 조각으로 문장을 절대 짓지 마세요 — 어순이 다름; 로케일별 완전 템플릿 문자열을 사용하세요.
- CJK 특화: 한글에 letter-spacing 조정 없음; 합성 볼드 없음(Pretendard는 진짜 웨이트를 가짐).

## 8. 세션과 시스템 상태(v6.1)

- **세션 만료:** 만료 60초 전 Modal("Your session ends in {n}s — continue working?" / "{n}초 후 세션이 만료됩니다 — 계속하시겠어요?")에 단일 계속 행동; 만료 시 제자리에서 재인증하고 모든 초안(Composer, 폼)이 왕복을 견딥니다. 편집 중 조용한 로그아웃은 금지됩니다.
- **점검:** `warning` subtle Banner로 앱 전체에 공지("Scheduled maintenance {window} — saves may be delayed." / content.md 템플릿). `solid` 스트립은 장애 등급 이벤트용으로 예약됩니다.
- **저하된 연결:** `neutral` Banner("Reconnecting… changes will sync when back." / "다시 연결하는 중입니다… 연결되면 변경사항이 동기화됩니다.") — 낙관적 변경은 대기열에 넣고, 비관적 변경은 이유와 함께 비활성화. 캐시된 콘텐츠를 읽을 수 있는 동안 절대 전체 화면 차단 안 함.
- **오류 페이지:** 레시피 R13 — 절대 맨 브라우저 오류 안 됨.
