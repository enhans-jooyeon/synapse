<!-- sy-source: be8234c14335e041 -->
# Synapse 아이콘 레지스트리

**닫힌 어휘.** AgentOS의 모든 아이콘은 이 개념→아이콘 표에서 가져옵니다(Lucide 이름, 20px 그리드에서 stroke 1.5, foundations §7에 따른 16/20/24 크기). 여기에 등재되지 않은 개념에는 **아이콘이 없습니다** — 등재되지 않은 Lucide 아이콘 사용, SVG 임의 제작, 등재된 아이콘을 다른 개념에 전용하는 것은 계약 위반입니다; 새 개념은 제안 경로를 거칩니다(design.md §6). 하나의 개념, 하나의 아이콘: 동일한 아이디어가 제품 어디에서도 두 개의 다른 글리프로 렌더링되지 않습니다.

## 내비게이션 및 크롬

**서드파티 제품 로고 (v6.17):** 브랜드 로고(Slack, Zendesk, Google Calendar, …)는 커넥터/연동 맥락 — 커넥터 목록, 연동 설정 행, 소스 출처 행 — 에서만 허용됩니다. 16px, 원본 브랜드 색상, 절대 색상 변경 금지, 절대 단색화 금지, 내비게이션 크롬 금지, 레지스트리 아이콘 대체 금지. 그 외 모든 곳에서는 아래의 닫힌 레지스트리가 유일한 아이콘 출처입니다.

| 개념 | 아이콘 | 참고 |
|---|---|---|
| 홈 | `house` | |
| 검색 | `search` | CommandPalette 입력란에도 사용 |
| 설정 | `settings` | |
| 메뉴 (좁은 창 내비게이션) | `menu` | 좁은 브라우저 창에서 접힌 레일 트리거 |
| 뒤로 / 앞으로 | `chevron-left` / `chevron-right` | |
| 펼치기 / 접기 (디스클로저) | `chevron-right`가 아래로 회전 | Accordion, 트리, 펼칠 수 있는 행 |
| 메뉴 열기 (드롭다운) | `chevron-down` | Select, split 버튼, 스위처 |
| 브레드크럼 구분자 | 텍스트 `/` | 아이콘 아님 |
| 외부 링크 | `arrow-up-right` | 후행 전용 |
| 도움말 | `circle-help` | |
| 알림 | `bell` | |
| 기록 / 활동 | `history` | |
| 대시보드 / 차트 | `chart-column` | |
| 표 보기 | `table-2` | |
| 목록 보기 / 로그 | `list` | |
| 그리드 보기 | `layout-grid` | |
| 워크스페이스 / 조직 | `building-2` | |
| 멤버 / 팀 | `users` | |
| 단일 사용자 | `user` | Avatar가 없을 때 폴백 |
| 언어 / 로케일 | `languages` | |
| 테마 | `sun` / `moon` | |
| 결제 / 요금제 | `credit-card` | |
| 키보드 단축키 | `keyboard` | |
| 로그아웃 | `log-out` | |
| 모두 읽음 표시 | `check-check` | NotificationCenter 헤더 |

## 동작

| 개념 | 아이콘 | 참고 |
|---|---|---|
| 만들기 / 추가 | `plus` | |
| 편집 | `pencil` | 아이콘 전용 승인됨 |
| 삭제 (영구) | `trash-2` | 아이콘 전용 승인됨 |
| 제거 (컬렉션에서) | `x` | Chip/닫기 ✕에도 사용 |
| 닫기 | `x` | 아이콘 전용 승인됨 |
| 복사 | `copy` | 아이콘 전용 승인됨 |
| 복제 | `copy-plus` | |
| 다운로드 / 내보내기 | `download` | |
| 업로드 / 가져오기 | `upload` | FileUpload 드롭존에도 사용 |
| 새로고침 / 동기화 | `refresh-cw` | 아이콘 전용 승인됨 |
| 다시 시도 | `rotate-cw` | 새로고침과 구분됨 |
| 필터 | `list-filter` | |
| 정렬 | `arrow-up` / `arrow-down` | 활성 열에만 |
| 델타 / 추세 | `trend-up` / `trend-down` | stat-card 델타 행에만 (v6.4) — 아이콘은 변화의 방향을 나타내고, 색상은 좋고 나쁨의 방향을 나타냄 |
| 더 보기 (오버플로) | `ellipsis` | 아이콘 전용 승인됨 |
| 보내기 | 채워진 원 맥락의 `arrow-up` | Composer 전용 |
| 중지 (생성/실행) | `square` | |
| 실행 / 재생 | `play` | |
| 일시 중지 | `pause` | |
| 고정 | `pin` | |
| 드래그 핸들 | `grip-vertical` | |
| 값 표시 / 숨기기 | `eye` / `eye-off` | 시크릿 표시 |
| 링크 / 참조 첨부 | `link` | |
| 첨부 | `paperclip` | Composer |
| 답장 / 인용 | `corner-up-left` | Reply pill + ComposerQuote 전용 (v6.12) |
| 후속 질문 | `arrow-right` | 후속 질문 패널 행에만 (v6.12) |
| 프롬프트 다듬기 | `pen-line` | Composer 입력 영역, 컨텍스트 오버레이 전용 (v6.25; v6.44에서 이동) |
| 음성 입력 | `mic` | Composer 푸터, 보내기 인접 후행 (v6.26; v6.43에서 이동) |
| 도구 / 기능 | `plug` | Composer 푸터 + 도구 행 (v6.41) |
| 프롬프트 템플릿 | `bookmark` | Composer 푸터 + 템플릿 라이브러리 행 (v6.29) |
| 즐겨찾기 | `star` | 템플릿 라이브러리 즐겨찾기 토글 (v6.34.1, 이전 pin); **활성 상태는 채워진 형태로 렌더링됨 — 레지스트리의 유일한 활성 시 채움 예외 (v6.34.3)**; 향후 목록 즐겨찾기는 거버넌스에 따름 |
| 일시 중지 | `pause` | 녹음 바 전용 (v6.26) |
| 승인 / 확인 | `check` | |
| 보내기 (Composer) | `arrow-up` | Composer의 승인된 아이콘 전용 보내기 |
| 재생성 | `refresh-ccw` | 새로고침/다시 시도와 구분됨 |
| 긍정 / 부정 피드백 | `thumbs-up` / `thumbs-down` | ResponseToolbar 전용 |
| 핸드오프 / 이관 | `arrow-right-left` | 에이전트↔사람 이관 행 |
| 전체 화면으로 확대 | `maximize-2` | 아이콘 전용 승인됨 (펼치기/접기 슬롯에 매핑) |
| 실행 취소 / 다시 실행 | `undo-2` / `redo-2` | |
| 확대 / 축소 | `zoom-in` / `zoom-out` | |

## 객체 및 상태

| 개념 | 아이콘 | 참고 |
|---|---|---|
| 에이전트 | **Synapse 에이전트 글리프** (등록된 커스텀 star 경로) | 절대 `sparkles`, `bot`, 또는 어떤 Lucide 대체 아이콘도 쓰지 않음 — 이것은 브랜드 등록되어 있으며, 정사각형 Avatar, 강조 버튼, 팔레트 행에 사용됨 |
| 실행 | `circle-play` | 상태 점이 없을 때 목록에서 |
| 예약 | `calendar` | DatePicker 트리거에도 사용 |
| 시간 | `clock` | 시간 필드, 소요 시간에도 사용 |
| 커넥터 | `plug` | |
| 웹훅 / API | `webhook` | |
| 데이터베이스 / 소스 | `database` | |
| 파일 / 문서 | `file-text` | |
| 폴더 | `folder` | |
| 이미지 | `image` | |
| 코드 | `code` | CodeBlock 언어 chip 영역 |
| 터미널 / 로그 | `terminal` | |
| 키 / 자격 증명 | `key-round` | |
| 보안 / 정책 / 가드레일 | `shield` | 하나의 개념: 규칙 기반 보호 (가드레일 알림 포함) |
| 잠금 / 비공개 | `lock` | |
| 정보 상태 | `info` | |
| 경고 상태 | `triangle-alert` | |
| 오류/위험 상태 | `circle-alert` | |
| 성공 상태 | `circle-check` | |
| 보고서 | `file-chart-column` | |
| 이메일 | `mail` | |
| 채팅 / 콘솔 | `message-square` | |

## 엄격한 규칙

- 레지스트리 아이콘만 사용; 매핑은 양방향(개념↔아이콘).
- 에이전트 글리프가 유일한 AI 아이코노그래피 — `sparkles`/`wand`/`bot`은 영구 금지.
- 상태 아이콘은 상태 색상과만 짝을 이룸(foundations §1.2); 절대 장식용 아님.
- 채워진 Lucide 변형은 금지(stroke 세트만), 1.5-stroke 규칙에 부합.
