<!-- sy-source: c5de39dd9e6350de -->
# Synapse 콘텐츠 시스템

AgentOS의 모든 UI 텍스트(한국어 및 영어)에 적용되는 보이스, 용어, 서식 규칙입니다. 이 파일은 `components.md`와 동일한 계약적 효력을 가집니다. 용어집은 닫힌 어휘이며, 생성되는 모든 문자열은 여기의 레지스터 및 템플릿 규칙을 따라야 합니다. 구조적 이중 언어 규칙(이탤릭 금지, 고정 너비 금지, `keep-all`, line-height 하한)은 `foundations.md` §2.3에 있으며, 이 파일은 단어 자체가 *무엇인지*를 규정합니다.

---

## 1. 보이스

AgentOS는 유능한 동료처럼 말합니다. 직접적이고, 차분하며, 구체적입니다. 사실을 진술하고, 동작을 명시하며, 감정을 연기하지 않습니다.

- 시스템의 처리 과정이 아니라 결과나 동작을 앞세웁니다. "The system has finished creating your report."가 아니라 "Report created"입니다.
- 형용사보다 숫자를 씁니다. "almost done."이 아니라 "Processed 312 of 328"입니다.
- 시스템이 생성한 텍스트에는 느낌표를 쓰지 않습니다. 절대로. 축하는 사용자의 몫입니다.
- 의인화된 연출 금지: "Oops!", "I'm so sorry!", "AI magic", "smart suggestions"는 절대 쓰지 않습니다. 에이전트는 자신의 동작을 설명할 때 1인칭을 쓸 수 있지만("I found 3 duplicates" / "중복 항목 3건을 찾았습니다"), 감정을 연기하는 데는 결코 쓰지 않습니다.
- 어떤 UI 문자열에도 이모지를 쓰지 않습니다.
- EN의 "Please"는 오류 메시지와 지시문에서 생략하며, 사용자에게 부담을 지우는 요청에서만 남깁니다("Please verify your email"). 한국어의 공손함은 동사 어미로 표현하며, 부디/제발을 덧붙이지 않습니다 — 이 표현들은 금지합니다.

## 2. 레지스터

**영어:** 모든 곳에서 sentence case를 사용합니다(foundations 수준에서 강제). 축약형("can't", "won't")은 허용하지만, 파괴적 확인과 법률 텍스트에서는 예외이며, 이때는 온전한 형태가 독자의 읽기 속도를 의도적으로 늦춥니다. serial comma: 사용합니다.

**한국어:** 모든 UI 텍스트 — 본문, 오류, 빈 상태, 에이전트 발화 — 에 합니다체(격식 있는 정중한 평서형)를 사용합니다. 해요체(엔터프라이즈에는 너무 캐주얼함)나 하십시오체(법률/컴플라이언스 텍스트 전용)는 사용하지 않습니다. 버튼과 메뉴 항목은 완전한 문장이 아니라 명사/서술성 명사형이나 -하기 형태를 사용합니다("저장", "에이전트 만들기" — "저장합니다"는 절대 금지). 사용자는 {이름}님으로 지칭하며, 제품은 자신을 저희라고 지칭하지 않습니다.

## 3. 용어집 — 닫힌 어휘

하나의 개념, 하나의 용어, 두 언어 모두. 금지어로 등재된 유의어는 자연스럽게 들리더라도 틀린 것입니다 — 일관성이 우아함보다 우선합니다. UI를 생성하는 에이전트는 제품 명사와 표준 동작을 반드시 이 표에서 가져와야 합니다.

### 3.1 제품 명사

| EN (canonical) | KO (canonical) | Forbidden alternatives |
|---|---|---|
| agent | 에이전트 | bot, assistant / 봇, 비서 |
| run (noun) | 실행 | job, execution / 런, 작업(for run) |
| workspace | 워크스페이스 | organization(as UI term) / 작업 공간 |
| connector | 커넥터 | integration / 연동(as noun), 인테그레이션 |
| source | 소스 | data source(long form) / 데이터 원본 |
| schedule (noun) | 예약 | 스케줄 |
| proposal (agent's) | 제안 | suggestion / 제의 |
| approval | 승인 | 허가, 컨펌 |
| member | 멤버 | user(when meaning member) / 구성원, 사용자(혼용) |
| permission | 권한 | access right / 퍼미션 |
| admin / owner / editor / viewer | 관리자 / 소유자 / 편집자 / 뷰어 | — |
| dashboard | 대시보드 | — |
| notification | 알림 | alert(as noun for notifications) / 노티 |
| error | 오류 | 에러 |
| settings | 설정 | preferences / 환경설정 |
| report | 보고서 | 리포트 |
| template | 템플릿 | 양식 |
| log | 로그 | history(when meaning log) / 기록(when meaning log) |

### 3.2 표준 동작 (버튼, 메뉴)

| EN | KO | 규칙 |
|---|---|---|
| Create … | … 만들기 | 버튼은 만들기를 사용하고, 시스템 메시지는 생성됨을 사용할 수 있습니다. |
| Save | 저장 | |
| Save changes | 변경사항 저장 | |
| Cancel (abort an edit) | 취소 | |
| Stop (halt generation/run) | 중지 | 절대 정지, 멈춤을 쓰지 않습니다. 취소와 구분됩니다. |
| Reply (quote a passage) | 답장 | Reply pill / ComposerQuote (v6.12). |
| Regenerate selection | 재생성 | Selection pill의 두 번째 동작 (v6.25). |
| Save as template | 템플릿으로 저장 | Message ⋯ 오버플로 메뉴 (v6.25). |
| New template | 새 템플릿 만들기 | Template library 푸터의 이스케이프 경로 (v6.29). |
| Add favorite | 즐겨찾기 추가 | 즐겨찾기 토글 (v6.34.1). |
| Remove favorite | 즐겨찾기 해제 | 즐겨찾기 토글 (v6.34.1). |
| New thread | 새 대화 | Console 사이드바 + ⌘K (v6.25). |
| Temporary chat | 임시 대화 | Agent-picker 스위치; Console에 임시 배지 표시 (v6.25). |
| Refine prompt | 프롬프트 다듬기 | Composer 푸터의 pen-line; 다듬기 메뉴의 일반 동작이기도 함 (v6.25/27). |
| Add detail | 더 자세히 | 다듬기 프리셋 (v6.27, 닫힌 집합). |
| Make concise | 더 간결하게 | 다듬기 프리셋 (v6.27, 닫힌 집합). |
| Specify scope | 기간·범위 구체화 | 다듬기 프리셋 (v6.27, 닫힌 집합). |
| Specify format | 형식 지정 | 다듬기 프리셋 (v6.27, 닫힌 집합). |
| Voice input | 음성 입력 | Mic 버튼 aria-label; 녹음 바 (v6.26). |
| Add | 추가 | Composer + 메뉴 aria-label (v6.44). |
| Tools | 도구 | Composer 도구 popover (v6.41). |
| Explain (selection) | 설명 | Selection pill 동작 (§18, v6.47). |
| Refine all | 전체 다듬기 | 일반 프리셋 행, §24 메뉴 (v6.47.3). |
| Prompt starters | 시작 제안 | 제로 상태 칩 (§27, v6.47). |
| Batch processing | 일괄 처리 | 실행을 대기열에 넣음 (§29, v6.47). |
| Model | 모델 | Composer 모델 선택기; 자동 = 에이전트 기본값 (v6.42). |
| Recording | 녹음 중 | 녹음 상태 안내 (v6.26). |
| Delete (permanent) | 삭제 | 되돌릴 수 없는 파괴에만 사용합니다. |
| Remove (from a collection) | 제거 | 항목은 다른 곳에 남아 있습니다. Delete/삭제와 절대 혼용하지 않습니다. |
| Edit | 편집 | 수정은 변경을 설명하는 문장 안에서만 쓰고, 버튼에는 절대 쓰지 않습니다. |
| Retry | 다시 시도 | 재시도는 밀집된 표에서만 허용합니다. |
| Approve / Reject | 승인 / 거절 | 허용/반려는 사용하지 않습니다. |
| Duplicate | 복제 | 복사 = Copy(클립보드)에만 사용합니다. |
| Copy | 복사 | |
| Export / Import | 내보내기 / 가져오기 | 익스포트는 금지합니다. |
| Sign in / Sign out | 로그인 / 로그아웃 | EN UI에서 "log in"/"log out"은 사용하지 않습니다. |
| Search | 검색 | |
| Filter | 필터 | |
| Clear (filters/selection) | 해제 | 지우기 = 콘텐츠를 지우는 경우. |
| Apply | 적용 | |
| Undo | 실행 취소 | 충돌 주의: 절대 취소로 줄이지 않습니다. |

### 3.3 상태 어휘

고정 집합이며, Badge 변형과 짝을 이룹니다(`components.md`):

| EN | KO | Badge |
|---|---|---|
| Draft | 초안 | neutral |
| Queued | 대기 중 | neutral |
| In progress | 진행 중 | info |
| Completed | 완료 | success |
| Needs review | 확인 필요 | warning |
| Cancelled | 취소됨 | warning |
| Failed | 실패 | danger |
| Paused | 일시 중지 | neutral |
| Pre-approved | 사전 승인됨 | neutral |

참고: 동작 버튼으로 오독될 수 있는 상태는 -됨을 붙이고(취소됨, 사전 승인됨), 나머지는 순수 명사형으로 둡니다(완료, 실패). 그 외에는 -됨을 붙이지 않습니다.

## 4. 템플릿 규칙 — 변수와 문자열의 결합 방식

1. **로케일마다 완전한 템플릿을 사용하며, 절대 이어붙이지 않습니다.** 어순이 다릅니다. "{count} runs deleted"와 "실행 기록 {count}개가 삭제되었습니다"는 조각을 바꿔 끼운 하나의 템플릿이 아니라 별개의 템플릿입니다.
2. **한국어 조사는 받침을 알 수 없는 변수에 직접 붙이지 않습니다.** 을/를, 이/가, 은/는, 과/와는 앞 음절에 따라 달라집니다. 금지: "{name}을 삭제할까요?" 및 편의적인 "{name}을(를)". 필수: 조사가 고정 명사에 오도록 재구성합니다 — "'{name}' 에이전트를 삭제할까요?" (조사는 에이전트에 붙고, 변수는 수식어로서 따옴표 안에 위치).
3. **셈 단위:** 한국어는 개/건/명으로 셉니다(건은 실행/문의/기록, 명은 사람, 개는 기본값). 영어는 올바르게 복수형을 만듭니다 — "(s)" 금지. 빈 상태는 "0 items"가 아니라 고유한 문자열을 씁니다.
4. **사용자가 이름 붙인 대상은 두 로케일 모두에서 따옴표로 감쌉니다**: '{name}'. KO에서는 구문 분석 모호성을 방지하고 EN에서는 깔끔하게 읽힙니다.
5. 가능한 한 변수로 한국어 문장을 시작하지 않습니다 — 분류 명사를 앞세웁니다.

## 5. 오류 메시지 카탈로그

구조는 항상 **[무슨 일이 일어났는가] · [정말 아는 경우, 이유] · [무엇을 해야 하는가]**입니다. 절대 탓하지 않고, 원인을 추측하지 않으며, 코드만 노출하지 않습니다. 코드는 지원 참조를 위해 끝에 괄호로 넣습니다.

| 분류 | EN template | KO template |
|---|---|---|
| Validation (field) | {Field} needs {constraint}. | {field}은 {constraint} 형식이어야 합니다. * |
| Permission | You don't have permission to {action}. Ask an admin for {role} access. | {action} 권한이 없습니다. 관리자에게 {role} 권한을 요청하세요. |
| Network | Couldn't reach AgentOS. Check your connection and retry. | 서버에 연결할 수 없습니다. 연결 상태를 확인한 후 다시 시도하세요. |
| Rate limit | {Service} rejected the request (rate limit). Retrying usually resolves this. | {service}이(가)… → restructure per §4.2: "{service} 연동이 요청을 거부했습니다(요청 한도 초과). 다시 시도하면 대부분 해결됩니다." |
| Not found | This {object} no longer exists. It may have been deleted. | 해당 {object}이 존재하지 않습니다. 삭제되었을 수 있습니다. * |
| Conflict | Someone changed this {object} while you were editing. Review their changes before saving. | 편집 중에 다른 멤버가 이 {object}을 변경했습니다. 변경 내용을 확인한 후 저장하세요. * |
| Partial failure | Processed {n} of {m}. {m−n} failed — view details. | {m}건 중 {n}건이 처리되었습니다. 실패한 {m−n}건을 확인하세요. |

\* {object}/{field}가 고정 용어집 명사(에이전트, 보고서…)인 경우, 조사는 명사별로 템플릿 인스턴스화 시점에 선택됩니다 — 템플릿은 (을)를 식 회피 표기가 아니라 객체 유형별로 저장됩니다.

파괴적 확인에서는 추가로 개수 + 명사 + 되돌릴 수 없음을 명시합니다: "Deletes 14 runs permanently. This can't be undone." / "실행 기록 14건이 영구 삭제됩니다. 되돌릴 수 없습니다."

**시스템 상태 템플릿 (v6.1):**

| 상태 | EN | KO |
|---|---|---|
| Unsaved changes | Leave without saving? Your changes will be lost. | 저장하지 않고 나가시겠어요? 변경사항이 사라집니다. |
| Session expiring | Your session ends in {n}s — continue working? | {n}초 후 세션이 만료됩니다 — 계속하시겠어요? |
| Rate limit | Too many requests — try again in {n}s. | 요청이 많아 잠시 제한되었습니다 — {n}초 후 다시 시도하세요. |
| Plan limit | Workspace is out of agent credits — runs are queued. | 워크스페이스 크레딧이 소진되어 실행이 대기 중입니다. |
| Maintenance | Scheduled maintenance {window} — saves may be delayed. | 예정된 점검({window}) 중에는 저장이 지연될 수 있습니다. |
| Reconnecting | Reconnecting… changes will sync when back. | 다시 연결하는 중입니다… 연결되면 변경사항이 동기화됩니다. |

## 6. 날짜, 숫자, 통화

| 항목 | EN | KO |
|---|---|---|
| Date | Jan 9, 2026 | 2026년 1월 9일 |
| Date, tables/dense | 2026-01-09 (both locales — ISO in data contexts) | 2026-01-09 |
| Time, prose | 2:02 PM | 오후 2:02 |
| Time, tables/logs | 14:02 (24h, both locales) | 14:02 |
| Datetime + tz (when it matters) | Jan 9, 2026, 14:02 KST | 2026년 1월 9일 14:02 KST |
| Relative | just now · 5m ago · 3h ago · yesterday · then absolute | 방금 · 5분 전 · 3시간 전 · 어제 · 이후 절대 표기 |
| Numbers | 1,234.56 | 1,234.56 (same separators) |
| Abbreviation (charts/stats) | 1.2k · 3.4M | 1.2천 · 340만 (만-based, not k/M) |
| Currency | $1,234.56 | ₩1,234,567 (KRW never shows decimals) |
| Percent | 12% (no space) | 12% (no space) |

상대 시각은 호버 시 항상 절대값을 표시합니다(`patterns.md` §6). 소요 시간: 4m 12s / 4분 12초; 표에서는 단위를 명시한 열 머리글과 함께 04:12를 쓸 수 있습니다.

## 7. 문장 부호 및 처리 규칙

- 레이블, 제목, 버튼, 메뉴 항목, Badge 텍스트: 두 로케일 모두 종결 마침표 없음. 완전한 문장(도움말 텍스트, 오류, 빈 상태 설명): 두 로케일 모두 종결 마침표 사용.
- 진행 중인 동사에는 말줄임표: … (단일 문자), 두 로케일 모두("Saving…" / "저장 중…").
- 가운뎃점(·)을 메타데이터 구분자로 사용합니다("5 steps · 12s" / "5단계 · 12초"); 메타데이터 행에서는 슬래시나 파이프를 절대 쓰지 않습니다.
- EN 엠 대시는 아껴 씁니다; KO는 쉼표를 쓰거나 재구성합니다 — UI의 범위 표기에 물결(~)을 절대 섞지 않습니다(–를 사용: "1–24").
- 한국어 텍스트에는 자간 조정, 이탤릭, 대문자 전체 표기를 절대 적용하지 않습니다(foundations §2.3); 한국어 문장 안의 로마자 브랜드명은 대소문자를 유지합니다(Slack, AgentOS).
- 키보드 키는 `.sy-kbd`로 렌더링하며, 풀어 쓰지 않고 기호로 표기합니다(⌘K).

## 8. 에이전트 발화

- 에이전트는 동작을 1인칭으로, 결과를 평이한 평서문으로 설명하며, 원본 데이터 언어와 무관하게 항상 사용자의 UI 로케일로 표현합니다("I searched 328 tickets" / "문의 328건을 검색했습니다" — 원본 콘텐츠 자체는 절대 자동 번역하지 않습니다).
- **Artific 브랜드 타이틀은 지역화하지 않는 유일한 문자열 유형입니다(v6.48).** Artific로 설정된 짧은 디스플레이 헤딩(Guided/빈 상태/HOME 히어로)은 브랜드 모먼트입니다: KO 로케일은 영어 단어를 Artific로 그대로 유지합니다 — 절대 번역하지 않고, Pretendard-Korean으로 렌더링하지 않습니다(Artific에는 한글이 없음; foundations §2.1 참조). 헤딩이 반드시 한국어여야 한다면 그것은 브랜드 모먼트가 아닙니다 — Artific를 버리고 디스플레이 크기의 Pretendard 볼드를 사용합니다. 이 예외는 Artific 브랜드 타이틀에만 엄격히 한정되며, 그 외 모든 UI 카피는 정상적으로 지역화합니다.
- 불확실성 완화 표현은 승인된 템플릿에서 가져옵니다(`ai-patterns.md` §7); 신뢰도 배지가 분류를 나타냅니다.
- 에이전트는 의도나 감정을 절대 주장하지 않고("I think you'll love this" — 금지), 아첨하지 않으며, 하나의 실패에 대해 두 번 이상 사과하지 않습니다("죄송합니다"는 많아야 한 번, 그다음은 사실).

## 9. 용어 추가

용어집은 컴포넌트 집합과 같은 방식으로 닫혀 있습니다: 필요하지만 없는 용어는 제안이며(`design.md` §6), 관리자가 결정하고, 금지 대체어와 함께 여기에 추가됩니다. 등재되지 않은 개념을 만난 에이전트는 가장 가까운 용어집 용어를 쓰거나 에스컬레이션합니다 — 절대 제품 어휘를 즉석에서 만들지 않습니다.
