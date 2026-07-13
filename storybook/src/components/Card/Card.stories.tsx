import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  args: { children: "Card content", variant: "flat" },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sy-space-16)", maxWidth: 720 }}>
      <Card lang="ko">flat — 기본. 배경 단차와 간격으로 구분합니다.</Card>
      <Card variant="outlined">outlined — separable objects.</Card>
      <Card variant="outlined" interactive>interactive — hover-lift, one action.</Card>
      <Card variant="outlined" selected>selected — key-color ring.</Card>
      <Card variant="ai" lang="ko">ai — 에이전트 생성 콘텐츠 컨테이너.</Card>
      <Card variant="elevated">elevated — max one per page.</Card>
    </div>
  ),
};
