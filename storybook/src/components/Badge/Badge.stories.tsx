import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Completed", color: "success" },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StatusRow: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-8)" }}>
      <Badge color="neutral">Draft</Badge>
      <Badge color="info" lang="ko">진행 중</Badge>
      <Badge color="success">Completed</Badge>
      <Badge color="warning" lang="ko">확인 필요</Badge>
      <Badge color="danger">Failed</Badge>
    </div>
  ),
};

export const RestrictedSolids: Story = {
  name: "Solids (named jobs only)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-8)" }}>
      <Badge color="danger" emphasis="solid">Incident</Badge>
      <Badge color="neutral" emphasis="solid">New</Badge>
      <Badge color="ai" emphasis="solid" lang="ko">실행 중</Badge>
    </div>
  ),
};
