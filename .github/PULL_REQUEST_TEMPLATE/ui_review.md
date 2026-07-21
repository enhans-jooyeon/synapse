# 리뷰 패키지 / PR 템플릿

> **작성 시점:** 리뷰 제출 시(PR 오픈). 리뷰어에게 **무엇을 볼지** 알려주고 **실행 가능한 산출물**을 넘깁니다.
> **관련 프로토콜:** `디자인-리뷰-프로토콜.md` §5-1, §8
> **권장 배치:** `.github/PULL_REQUEST_TEMPLATE/ui_review.md` 로 저장 → 저장소에 기록되고 diff됨 (code-based end-to-end).

---

## UI 리뷰 패키지

<!-- 위에 PRD를 붙이거나 링크 -->

### localhost 실행 (필수 — 리뷰어는 raw 코드를 읽지 않음)
- **실행 명령어(원커맨드):** (예: `pnpm dev` 또는 `pnpm storybook`)
- **접속 주소:** (예: http://localhost:6006)
- **브랜치별 프리뷰 배포(있으면):** (Vercel 링크 — 클론 없이 확인)
- **각 상태로 가는 경로 / story:** (아래 표에 링크)

### 먼저 볼 것 (What to look at first)
1.
2.
3.

### 상태 커버리지
| 상태 | story / 경로 | 비고 |
|---|---|---|
| default | | |
| empty | | |
| loading | | |
| error | | |
| overflow / 긴 콘텐츠 | | |
| 긴 한국어 문자열 | | |
| 권한 variant: … | | |

### 브레이크포인트 확인
- [ ] narrow / mobile
- [ ] default / desktop
- [ ] dense-data / wide

### 자동 게이트 상태
- [ ] 모든 CI 게이트 green (실행 링크)

### 명시적 사인오프가 필요한 일탈
-
