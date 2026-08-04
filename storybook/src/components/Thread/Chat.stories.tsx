import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Thread } from "./Thread";
import { Message } from "../Message/Message";
import { AnswerHeader } from "../AnswerHeader/AnswerHeader";
import { VariantPager } from "../VariantPager/VariantPager";
import { Reasoning } from "../Reasoning/Reasoning";
import { SelectionPill } from "../SelectionPill/SelectionPill";
import { FollowUpPanel } from "../FollowUpPanel/FollowUpPanel";
import { ConversationSummary } from "../ConversationSummary/ConversationSummary";

/**
 * The assembled Console conversation.
 *
 * NOTE: `recipes.md` has no chat recipe (deliberately out of scope for the
 * 2026-08-03 tranche), so this story is currently the only canonical
 * composition of the eight chat components — including the agent content
 * column's FIXED element order, which no single component can enforce alone.
 * If a Console recipe lands later, this story should defer to it.
 */
const meta = { title: "AI patterns/Chat surface" } satisfies Meta;
export default meta;
type Story = StoryObj;

const PILL_LABELS = { reply: "답장", explain: "설명", regenerate: "재생성" } as const;

export const AssembledThread: Story = {
  render: () => {
    const [variant, setVariant] = useState(2);
    const [expanded, setExpanded] = useState(true);
    return (
      <div style={{ height: 520, border: "1px solid var(--sy-border-default)", borderRadius: "var(--sy-radius-xl)", background: "var(--sy-bg-page)" }}>
        <Thread jumpLabel="최신으로 이동">
          <ConversationSummary
            agentName="주간 보고서 에이전트"
            timestamp="14:02"
            lastGenerated="2분 전 생성"
            onRefresh={() => {}}
            title="대화 요약"
          >
            <span lang="ko">결정 2건 · 후속 작업 1건 · 미해결 질문 1건</span>
          </ConversationSummary>

          <Message variant="human" actor="June">
            <span lang="ko">지난주 고객 문의 요약해서 보고서 초안 만들어 줘</span>
          </Message>

          {/* Agent content column — order is FIXED (components.md · Message). */}
          <Message variant="agent" actor="주간 보고서 에이전트" state="settled">
            <Reasoning label="추론 과정" duration="4.1s">
              <span lang="ko">문의 데이터를 주제별로 분류한 뒤 상위 항목을 추렸습니다.</span>
            </Reasoning>
            <AnswerHeader
              title="주간 고객 문의 요약"
              duration="12.4s"
              expanded={expanded}
              onToggle={setExpanded}
              pager={<VariantPager index={variant} total={2} onChange={setVariant} />}
            />
            {expanded && (
              <p style={{ marginTop: "var(--sy-space-2)" }} lang="ko">
                지난주 문의는 총 328건으로 전주 대비 12% 증가했습니다.{" "}
                <span className="sy-quote-highlight">상위 주제는 결제 오류(47건)와 로그인 문제(31건)입니다</span>
              </p>
            )}
          </Message>
        </Thread>
      </div>
    );
  },
};

export const SelectionPillOnly: Story = {
  render: () => (
    <div style={{ padding: "var(--sy-space-8)" }}>
      <SelectionPill labels={PILL_LABELS} onAction={() => {}} />
      <p className="sy-type-caption" style={{ color: "var(--sy-text-tertiary)", marginTop: "var(--sy-space-4)" }}>
        Closed set of three (ruling 2026-08-03). Agent messages only — selecting a human bubble raises nothing.
      </p>
    </div>
  ),
};

export const FollowUps: Story = {
  render: () => (
    <div style={{ padding: "var(--sy-space-6)", maxWidth: 420 }}>
      <FollowUpPanel
        keycapHint="↑↓ 이동 · ↵ 선택 · esc 닫기"
        groupLabels={{ refine: "더 자세히", pivot: "다음 단계" }}
        rows={[
          { label: "결제 오류 47건의 원인을 분석해 줘", intent: "refine" },
          { label: "로그인 문제 31건도 같이 봐줘", intent: "refine" },
          { label: "보고서로 만들기", intent: "pivot" },
          { label: "#ops에 공유하기", intent: "pivot" },
        ]}
        onSelect={() => {}}
      />
    </div>
  ),
};

/** Over-cap input: 6 rows in, 4 rendered, refine first. */
export const FollowUpsRespectCap: Story = {
  render: () => (
    <div style={{ padding: "var(--sy-space-6)", maxWidth: 420 }}>
      <FollowUpPanel
        rows={[
          { label: "pivot A", intent: "pivot" },
          { label: "refine A", intent: "refine" },
          { label: "pivot B", intent: "pivot" },
          { label: "refine B", intent: "refine" },
          { label: "refine C", intent: "refine" },
          { label: "pivot C", intent: "pivot" },
        ]}
        onSelect={() => {}}
      />
    </div>
  ),
};
