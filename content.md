# Synapse content system

Voice, terminology, and formatting rules for all UI text in AgentOS, Korean and English. This file has the same contractual force as `components.md`: the glossary is a closed vocabulary, and every generated string must follow the register and template rules here. Structural bilingual rules (no italics, no fixed widths, `keep-all`, line-height floors) live in `foundations.md` §2.3; this file governs what the words *are*.

---

## 1. Voice

AgentOS speaks like a competent colleague: direct, calm, specific. It states facts, names actions, and never performs emotion.

- Lead with the outcome or the action, not the system's process. "Report created" not "The system has finished creating your report."
- Numbers over adjectives: "Processed 312 of 328" not "almost done."
- No exclamation marks in system-generated text. None. Celebration is the user's job.
- No anthropomorphic theatrics: never "Oops!", "I'm so sorry!", "AI magic", "smart suggestions". Agents may use first person to describe their own actions ("I found 3 duplicates" / "중복 항목 3건을 찾았습니다") but never to perform feelings.
- No emoji in any UI string.
- "Please" (EN) is omitted in errors and instructions; it survives only in requests that impose on the user ("Please verify your email"). Korean politeness is carried by the verb ending, not by adding 부디/제발 — which are forbidden.

## 2. Register

**English:** sentence case everywhere (enforced at the foundations level). Contractions allowed ("can't", "won't") except in destructive confirmations and legal text, where full forms slow the reader down deliberately. Serial comma: yes.

**Korean:** 합니다체 (formal-polite declarative) for all UI text — body, errors, empty states, agent speech. Not 해요체 (too casual for enterprise), not 하십시오체 (reserved for legal/compliance text only). Buttons and menu items use noun/verbal-noun form or -하기 form, not full sentences ("저장", "에이전트 만들기" — never "저장합니다"). Users are addressed as {이름}님; the product never refers to itself as 저희.

## 3. Terminology glossary — closed vocabulary

One concept, one term, both languages. Synonyms listed as forbidden are wrong even when they sound natural — consistency beats elegance. Agents generating UI MUST draw product nouns and standard actions from this table.

### 3.1 Product nouns

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

### 3.2 Standard actions (buttons, menus)

| EN | KO | Rule |
|---|---|---|
| Create … | … 만들기 | Buttons use 만들기; system messages may use 생성됨. |
| Save | 저장 | |
| Save changes | 변경사항 저장 | |
| Cancel (abort an edit) | 취소 | |
| Stop (halt generation/run) | 중지 | Never 정지, 멈춤. Distinct from 취소. |
| Reply (quote a passage) | 답장 | Reply pill / ComposerQuote (v6.12). |
| Regenerate selection | 재생성 | Selection pill second action (v6.25). |
| Save as template | 템플릿으로 저장 | Message ⋯ overflow (v6.25). |
| New template | 새 템플릿 만들기 | Template library footer escape (v6.29). |
| Add favorite | 즐겨찾기 추가 | Favorite toggles (v6.34.1). |
| Remove favorite | 즐겨찾기 해제 | Favorite toggles (v6.34.1). |
| New thread | 새 대화 | Console sidebar + ⌘K (v6.25). |
| Temporary chat | 임시 대화 | Agent-picker switch; Console shows 임시 badge (v6.25). |
| Refine prompt | 프롬프트 다듬기 | Composer footer pen-line; also the refinement menu's general action (v6.25/27). |
| Add detail | 더 자세히 | Refinement preset (v6.27, closed set). |
| Make concise | 더 간결하게 | Refinement preset (v6.27, closed set). |
| Specify scope | 기간·범위 구체화 | Refinement preset (v6.27, closed set). |
| Specify format | 형식 지정 | Refinement preset (v6.27, closed set). |
| Voice input | 음성 입력 | Mic button aria-label; recording bar (v6.26). |
| Add | 추가 | Composer + menu aria-label (v6.44). |
| Tools | 도구 | Composer tools popover (v6.41). |
| Explain (selection) | 설명 | Selection pill action (§18, v6.47). |
| Refine all | 전체 다듬기 | General preset row, §24 menu (v6.47.3). |
| Prompt starters | 시작 제안 | Zero-state chips (§27, v6.47). |
| Batch processing | 일괄 처리 | Queue runs (§29, v6.47). |
| Model | 모델 | Composer model selector; 자동 = agent default (v6.42). |
| Recording | 녹음 중 | Recording-state announcement (v6.26). |
| Delete (permanent) | 삭제 | Only for irreversible destruction. |
| Remove (from a collection) | 제거 | Item survives elsewhere. NEVER interchangeable with Delete/삭제. |
| Edit | 편집 | 수정 only inside sentences describing a change, never on buttons. |
| Retry | 다시 시도 | 재시도 allowed in dense tables only. |
| Approve / Reject | 승인 / 거절 | Not 허용/반려. |
| Duplicate | 복제 | 복사 = Copy (clipboard) only. |
| Copy | 복사 | |
| Export / Import | 내보내기 / 가져오기 | 익스포트 forbidden. |
| Sign in / Sign out | 로그인 / 로그아웃 | Not "log in"/"log out" in EN UI. |
| Search | 검색 | |
| Filter | 필터 | |
| Clear (filters/selection) | 해제 | 지우기 = clearing content. |
| Apply | 적용 | |
| Undo | 실행 취소 | Collision warning: never shorten to 취소. |

### 3.3 Status vocabulary

Fixed set, paired with Badge variants (`components.md`):

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

Note: statuses that could be misread as action buttons take -됨 (취소됨, 사전 승인됨); the rest stay in bare noun form (완료, 실패). Do not add -됨 elsewhere.

## 4. Template rules — how variables and strings combine

1. **Complete templates per locale, never concatenation.** Word order differs; "{count} runs deleted" and "실행 기록 {count}개가 삭제되었습니다" are separate templates, not one template with swapped fragments.
2. **Korean particles never attach directly to a variable whose final consonant is unknown.** 을/를, 이/가, 은/는, 과/와 alternate on the preceding syllable. Forbidden: "{name}을 삭제할까요?" and the lazy "{name}을(를)". Required: restructure so the particle lands on a fixed noun — "'{name}' 에이전트를 삭제할까요?" (particle attaches to 에이전트, the variable sits in quotes as a modifier).
3. **Counters:** Korean counts with 개/건/명 (건 for runs/inquiries/records, 명 for people, 개 as default). English pluralizes properly — no "(s)". Zero states get their own string, not "0 items".
4. **Quotes around user-named entities** in both locales: '{name}'. Prevents parsing ambiguity in KO and reads cleanly in EN.
5. Variables never start a Korean sentence when avoidable — lead with the classifier noun.

## 5. Error message catalog

Structure, always: **[what happened] · [why, if truly known] · [what to do]**. Never blame, never guess causes, never bare codes. Codes go in parentheses at the end for support reference.

| Class | EN template | KO template |
|---|---|---|
| Validation (field) | {Field} needs {constraint}. | {field}은 {constraint} 형식이어야 합니다. * |
| Permission | You don't have permission to {action}. Ask an admin for {role} access. | {action} 권한이 없습니다. 관리자에게 {role} 권한을 요청하세요. |
| Network | Couldn't reach AgentOS. Check your connection and retry. | 서버에 연결할 수 없습니다. 연결 상태를 확인한 후 다시 시도하세요. |
| Rate limit | {Service} rejected the request (rate limit). Retrying usually resolves this. | {service}이(가)… → restructure per §4.2: "{service} 연동이 요청을 거부했습니다(요청 한도 초과). 다시 시도하면 대부분 해결됩니다." |
| Not found | This {object} no longer exists. It may have been deleted. | 해당 {object}이 존재하지 않습니다. 삭제되었을 수 있습니다. * |
| Conflict | Someone changed this {object} while you were editing. Review their changes before saving. | 편집 중에 다른 멤버가 이 {object}을 변경했습니다. 변경 내용을 확인한 후 저장하세요. * |
| Partial failure | Processed {n} of {m}. {m−n} failed — view details. | {m}건 중 {n}건이 처리되었습니다. 실패한 {m−n}건을 확인하세요. |

\* Where {object}/{field} is a fixed glossary noun (에이전트, 보고서…), the particle is chosen at template-instantiation time per noun — templates are stored per object type, not with (을)를 hedges.

Destructive confirmations additionally name count + noun + irreversibility: "Deletes 14 runs permanently. This can't be undone." / "실행 기록 14건이 영구 삭제됩니다. 되돌릴 수 없습니다."

**System-state templates (v6.1):**

| State | EN | KO |
|---|---|---|
| Unsaved changes | Leave without saving? Your changes will be lost. | 저장하지 않고 나가시겠어요? 변경사항이 사라집니다. |
| Session expiring | Your session ends in {n}s — continue working? | {n}초 후 세션이 만료됩니다 — 계속하시겠어요? |
| Rate limit | Too many requests — try again in {n}s. | 요청이 많아 잠시 제한되었습니다 — {n}초 후 다시 시도하세요. |
| Plan limit | Workspace is out of agent credits — runs are queued. | 워크스페이스 크레딧이 소진되어 실행이 대기 중입니다. |
| Maintenance | Scheduled maintenance {window} — saves may be delayed. | 예정된 점검({window}) 중에는 저장이 지연될 수 있습니다. |
| Reconnecting | Reconnecting… changes will sync when back. | 다시 연결하는 중입니다… 연결되면 변경사항이 동기화됩니다. |

## 6. Dates, numbers, currency

| Item | EN | KO |
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

Relative timestamps always reveal the absolute value on hover (`patterns.md` §6). Durations: 4m 12s / 4분 12초; tables may use 04:12 with a column header stating the unit.

## 7. Punctuation & mechanics

- Labels, titles, buttons, menu items, Badge text: no terminal period, both locales. Full sentences (helper text, errors, empty-state descriptions): terminal period, both locales.
- Ellipsis for in-progress verbs: … (single character), both locales ("Saving…" / "저장 중…").
- Middle dot (·) as the metadata separator ("5 steps · 12s" / "5단계 · 12초"); never slashes or pipes in metadata rows.
- EN em dash usage sparingly; KO uses comma or restructures — never mixes 물결(~) into ranges in UI (use –: "1–24").
- Korean text never takes letter-spacing, italic, or ALL-CAPS treatment (foundations §2.3); romanized brand names inside Korean sentences keep their casing (Slack, AgentOS).
- Keyboard keys render via `.sy-kbd`, referenced by symbol (⌘K), not spelled out.

## 8. Agent speech

- Agents describe actions in first person, results in plain declaratives, and always in the user's UI locale regardless of source-data language ("I searched 328 tickets" / "문의 328건을 검색했습니다" — source content itself is never auto-translated).
- **Artific brand titles are the one string type that does NOT localize (v6.48).** A short display heading set in Artific (Guided/empty-state/HOME hero) is a brand moment: the KO locale keeps the English words verbatim, in Artific — never translated, never rendered in Pretendard-Korean (Artific has no Hangul; see foundations §2.1). If a heading must be Korean, it is not a brand moment — drop Artific and use Pretendard bold at the display size. This exception is scoped strictly to Artific brand titles; all other UI copy localizes normally.
- Uncertainty hedges come from the approved templates (`ai-patterns.md` §7); confidence badges carry the classification.
- Agents never claim intent or emotion ("I think you'll love this" — forbidden), never flatter, and never apologize more than once per failure ("죄송합니다" at most once, then facts).

## 9. Adding terms

The glossary is closed the same way the component set is: a needed-but-missing term is a proposal (`design.md` §6), decided by a maintainer, added here with its forbidden alternatives. Agents encountering an unlisted concept use the closest glossary term or escalate — they never coin product vocabulary inline.
