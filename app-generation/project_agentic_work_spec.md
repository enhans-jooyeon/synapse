---
name: CommerceOS Agentic Work 스펙
description: COS의 Agentic Work 전체 스펙 — Workflow(Agent), Automation, 노드 유형 정리
type: project
---

## Agentic Work란?
- AI 프로세스를 만들고 배포해서 커머스 운영 전반에 자동 실행
- AI Chat(즉흥 탐색) vs Agentic Work(정해진 로직 반복 안정 실행)
- 두 핵심 개념: **Workflow**(무엇을) + **Automation**(언제)
- Pipeline Builder는 별도 — 원시 데이터 ETL용

## Workflow (Agent)
- 시각적 워크플로로 정의되는 독립 프로세스
- Start → 노드들 → End 방향 그래프
- draft-and-deploy 생애주기 (버전 관리)
- 배포 후 수동 실행 or Automation 연결

### Agent 목록 구성
- **System Agents**: COS 제공 사전 구축, 실행O 수정X
- **My Agents**: 본인 생성, 전체 권한
- **Team Agents**: 팀원 생성, 실행/조회O 수정X

### Workflow Builder
- Build 모드: 설계 (노드 추가/설정/연결)
- Run 모드: 테스트 (Test Run, 실시간 로그)
- 캔버스 좌측 툴바: Add Node, Select, Pan, Align Nodes

### 노드 유형
1. **Agent** — LLM 추론. 분석/요약/분류/생성 등. System Prompt + {{variable}} 문법
2. **Code** — Python 코드 실행. 정확한 결정론적 로직용
3. **Condition** — If/Else 분기. 연산자: ==, !=, >, <, >=, <=, &&, ||
4. **Wait** — 실행 일시 중지. API 속도 제한, 발송 간격 조절용
5. **Email** — SMTP 이메일 발송. {{variable}} 템플릿 지원
6. **HITL (Human-in-the-Loop)** — 사람 승인 게이트. Approved/Rejected 분기
7. **Create Ontology** — 데이터를 Ontology 객체로 저장 (생성만, 업데이트 X)
8. **Ontology Query** — Ontology에서 데이터 읽기. SQL 스타일 쿼리

## Automation
- If/Then 구조. 트리거 → 작업 실행
- **My Automations** / **Team Automations**
- 캘린더 사이드바: 날짜별 Running/Pending/Completed 확인

### 트리거 유형
- **Event**: Ontology 데이터 변경 시 (현재: New row created만 지원)
- **Schedule**: Hourly / Daily / Weekly, 타임존 설정 가능

### 작업 (Then)
- 배포된 Agent 선택
- Additional Input: 보충 지시 텍스트
- 실행 결과 이메일 수신 옵션

### Scope
- Only Me / Entire Group

## COS 내 역할
Ontology ↔ Agentic Work ↔ Dashboard / Pipeline / AI Chat 연결하는 실행 레이어
