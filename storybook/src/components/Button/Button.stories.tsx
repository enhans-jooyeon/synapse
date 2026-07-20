import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

/** Spec: components.md · Button — the story set mirrors the manifest's closed lists. */
const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Save changes", variant: "secondary", size: "md" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-12)", flexWrap: "wrap" }}>
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary" lang="ko">변경사항 저장</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger" lang="ko">영구 삭제</Button>
      <Button variant="brand">Ask agent</Button>
      <Button disabled>Disabled</Button>
      <Button variant="primary" loading>Saving…</Button>
    </div>
  ),
};

export const PillHeroOnly: Story = {
  name: "Pill (Guided heroes only)",
  render: () => <Button variant="primary" pill lang="ko">에이전트 만들기</Button>,
};
