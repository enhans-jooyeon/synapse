import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup } from "./Avatar";
import type { AvatarSize } from "./Avatar";

/**
 * Spec: components.md · Avatar (last synced 2026-08-05).
 * SYNC partner of Avatar.tsx / Avatar.css — the stories exercise the closed size set
 * (20/24/32/40/56), both shapes (human circle / agent square — shape alone must scan
 * authorship), both status vocabularies (never both in one real view), the deterministic
 * initials tint, and the group stack with its "+N" overflow.
 */
const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { name: "Jooyeon Park", kind: "human", size: 32 },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: readonly AvatarSize[] = [20, 24, 32, 40, 56];

export const Playground: Story = {};

export const SizesAndShapes: Story = {
  name: "Sizes × shapes (human circle, agent square)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sy-space-4)" }}>
      <div style={{ display: "flex", gap: "var(--sy-space-3)", alignItems: "center" }}>
        {SIZES.map((s) => (
          <Avatar key={s} name="Jooyeon Park" size={s} />
        ))}
      </div>
      {/* Squared = agent, mandatory product language — never round agents, never square humans. */}
      <div style={{ display: "flex", gap: "var(--sy-space-3)", alignItems: "center" }}>
        {SIZES.map((s) => (
          <Avatar key={s} name="Synapse Agent" kind="agent" size={s} />
        ))}
      </div>
    </div>
  ),
};

export const Initials: Story = {
  name: "Initials (deterministic viz tint)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-3)", alignItems: "center" }}>
      {/* 2 Latin letters / 1 Hangul syllable; same name → same hue, every session. */}
      <Avatar name="Jooyeon Park" size={40} />
      <Avatar name="Minsu Kim" size={40} />
      <Avatar name="Ada Lovelace" size={40} />
      <span lang="ko" style={{ display: "inline-flex", gap: "var(--sy-space-3)" }}>
        <Avatar name="박주연" size={40} />
        <Avatar name="김민수" size={40} />
      </span>
      <Avatar name="Report Agent" kind="agent" size={40} />
    </div>
  ),
};

export const HumanPresence: Story = {
  name: "Status — human presence vocabulary",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-4)", alignItems: "center" }}>
      <Avatar name="Jooyeon Park" size={40} status="active" statusLabel="active" />
      <Avatar name="Minsu Kim" size={40} status="away" statusLabel="away" />
      {/* size 20 NEVER carries a dot — the status is ignored (and warned) by design. */}
      <Avatar name="Ada Lovelace" size={20} />
    </div>
  ),
};

export const AgentRunState: Story = {
  name: "Status — agent run-state vocabulary",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-4)", alignItems: "center" }}>
      {/* running pulses (opacity-only; stops under reduced motion); idle = no dot. */}
      <Avatar name="Report Agent" kind="agent" size={40} status="running" statusLabel="running" />
      <Avatar name="Deploy Agent" kind="agent" size={40} status="failed" statusLabel="failed" />
      <Avatar name="Idle Agent" kind="agent" size={40} />
    </div>
  ),
};

export const Group: Story = {
  name: "AvatarGroup (max 4 + “+N”, humans first)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sy-space-4)", alignItems: "flex-start" }}>
      <AvatarGroup
        size={32}
        items={[
          { name: "Jooyeon Park" },
          { name: "Report Agent", kind: "agent" },
          { name: "Minsu Kim" },
          { name: "Ada Lovelace" },
        ]}
      />
      {/* 6 members → 4 visible + “+2”; agents sort after humans regardless of input order.
          The click is meant to open a Popover listing all — not in the library yet (FLAGGED). */}
      <AvatarGroup
        size={32}
        onOverflowClick={() => {}}
        items={[
          { name: "Deploy Agent", kind: "agent" },
          { name: "Jooyeon Park" },
          { name: "Minsu Kim" },
          { name: "Report Agent", kind: "agent" },
          { name: "Ada Lovelace" },
          { name: "Grace Hopper" },
        ]}
      />
    </div>
  ),
};
