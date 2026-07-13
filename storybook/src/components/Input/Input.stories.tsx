import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { label: "Workspace name", placeholder: "e.g. Growth team" },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-16)", flexWrap: "wrap", alignItems: "flex-start" }}>
      <Input label="Workspace name" placeholder="e.g. Growth team" helper="Visible to all members." />
      <Input lang="ko" label="이메일 주소" defaultValue="jooyeon@enhans"
        error="이메일 형식이 아닙니다. '@' 뒤에 도메인을 입력하세요." />
      <Input label="API endpoint" defaultValue="https://api.enhans.ai/v1" readOnly />
      <Input label="Disabled" defaultValue="Not available on this plan" disabled />
      <Input label="Amount" defaultValue="1200000" trailing="KRW" />
      <Input lang="ko" label="재시도 한도 — 일괄 편집" placeholder="여러 값" />
    </div>
  ),
};
