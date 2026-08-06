import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";
import { Avatar } from "../Avatar/Avatar";

/**
 * Spec: components.md · Chip (fill-encodes-interactivity, 2026-07-30; last synced 2026-08-05).
 * SYNC partner of Chip.tsx / Chip.css — the stories exercise the closed variant set
 * (input · list-filter · suggestion; `category` RETIRED 2026-07-30), both selection
 * models, the disabled treatment, and the KO remove-label localization.
 *
 * Gallery caveat: jurisdiction rules (suggestion chips: console/empty states only, max 3;
 * never mix input and list-filter in one row) are deliberately violated here — a specimen
 * sheet, not a screen.
 */
const meta = {
  title: "Components/Chip",
  component: Chip,
  args: { variant: "input", children: "Design systems", removeLabel: "Remove" },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InputChips: Story = {
  name: "input (removable selections)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-2)", alignItems: "center", flexWrap: "wrap" }}>
      {/* The chip body is NOT a target — only the ✕ removes (aria-label required). */}
      <Chip variant="input" onRemove={() => {}}>Design systems</Chip>
      <Chip variant="input" onRemove={() => {}}>Quarterly report</Chip>
      {/* Leading Avatar when the value is a person or agent — spec says "Avatar 16",
          which is OUTSIDE Avatar's closed size set (FLAGGED); the slot clamps to 16px. */}
      <Chip variant="input" onRemove={() => {}} avatar={<Avatar name="Jooyeon Park" size={20} />}>
        Jooyeon Park
      </Chip>
      <span lang="ko">
        <Chip variant="input" onRemove={() => {}} removeLabel="제거">시장 조사</Chip>
      </span>
    </div>
  ),
};

export const ListFilterMulti: Story = {
  name: "list-filter, multi-select (no fill)",
  render: function Render() {
    const [on, setOn] = React.useState<Record<string, boolean>>({ Running: true, Failed: true });
    const toggle = (k: string) => setOn((s) => ({ ...s, [k]: !s[k] }));
    return (
      <div style={{ display: "flex", gap: "var(--sy-space-2)" }}>
        {/* Selected multi chips take NO fill — border.selected + ✓ do the work, so a row
            of selected filters stays quieter than the content it filters. */}
        {["Running", "Failed", "Queued", "Archived"].map((k) => (
          <Chip key={k} variant="list-filter" selectionMode="multi" selected={!!on[k]} onClick={() => toggle(k)}>
            {k}
          </Chip>
        ))}
      </div>
    );
  },
};

export const ListFilterSingle: Story = {
  name: "list-filter, single-select (bg.inverse-soft)",
  render: function Render() {
    const [val, setVal] = React.useState("7D");
    return (
      <div style={{ display: "flex", gap: "var(--sy-space-2)" }}>
        {/* Exactly one active chip: the solid softened key (bg.inverse-soft, NOT bg.inverse —
            pure key black is byte-identical to action.primary-bg). */}
        {["1D", "7D", "30D", "All"].map((k) => (
          <Chip key={k} variant="list-filter" selectionMode="single" selected={val === k} onClick={() => setVal(k)}>
            {k}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Suggestion: Story = {
  name: "suggestion (console/empty states only, max 3)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-2)" }}>
      {/* bg.raised + hairline; hover steps bg.hover + border.strong. Carries no glyph —
          the spec contradiction is FLAGGED, not resolved. */}
      <Chip variant="suggestion" onClick={() => {}}>Summarize this run</Chip>
      <Chip variant="suggestion" onClick={() => {}}>Compare with last week</Chip>
      <span lang="ko">
        <Chip variant="suggestion" onClick={() => {}}>보고서 초안 만들기</Chip>
      </span>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-2)", alignItems: "center" }}>
      {/* text.disabled + border.subtle — NEVER opacity. Selected fills collapse to the
          disabled outline (a live inverse fill on a dead control reads as available). */}
      <Chip variant="input" disabled onRemove={() => {}}>Design systems</Chip>
      <Chip variant="list-filter" disabled>Archived</Chip>
      <Chip variant="list-filter" selectionMode="single" selected disabled>30D</Chip>
      <Chip variant="suggestion" disabled>Summarize this run</Chip>
    </div>
  ),
};
