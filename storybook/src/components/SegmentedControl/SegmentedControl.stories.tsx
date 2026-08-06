import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "./SegmentedControl";

/**
 * Spec: components.md · SegmentedControl (last synced 2026-08-05).
 * SYNC partner of SegmentedControl.tsx / SegmentedControl.css — the stories exercise the
 * 2–5 range, the concentric geometry (tray 12 − 4px inset = nested 8; assembled height 32
 * per the Anatomy prose — the 36 in the Key rules bullet is FLAGGED as a contradiction),
 * icon-only segments (approved registry glyphs), whole-control disabled, and KO widths.
 */
const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  args: {
    options: [
      { value: "1d", label: "1D" },
      { value: "7d", label: "7D" },
      { value: "30d", label: "30D" },
    ],
    defaultValue: "7d",
  },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Registry glyphs (icons.md · Lucide): `list` = list view, `layout-grid` = grid view. */
const icon = (paths: string) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }}
    dangerouslySetInnerHTML={{ __html: paths }}
  />
);
const ListIcon = icon('<path d="M3 5h.01" /><path d="M3 12h.01" /><path d="M3 19h.01" /><path d="M8 5h13" /><path d="M8 12h13" /><path d="M8 19h13" />');
const GridIcon = icon('<rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />');

export const Playground: Story = {};

export const ChartPeriods: Story = {
  name: "Chart periods (immediate effect)",
  render: function Render() {
    const [val, setVal] = React.useState("7d");
    return (
      <SegmentedControl
        aria-label="Chart period"
        options={[
          { value: "1d", label: "1D" },
          { value: "7d", label: "7D" },
          { value: "30d", label: "30D" },
          { value: "90d", label: "90D" },
        ]}
        value={val}
        onChange={setVal}
      />
    );
  },
};

export const IconOnly: Story = {
  name: "Icon-only (layout toggle)",
  render: function Render() {
    const [val, setVal] = React.useState("list");
    return (
      // Approved registry glyphs only; each label becomes the segment's aria-label.
      // Mixing icon+text and text-only segments in one control is forbidden — homogeneity
      // comes from the control-level flag.
      <SegmentedControl
        aria-label="Layout"
        iconOnly
        options={[
          { value: "list", label: "List view", icon: ListIcon },
          { value: "grid", label: "Grid view", icon: GridIcon },
        ]}
        value={val}
        onChange={setVal}
      />
    );
  },
};

export const Bilingual: Story = {
  name: "Bilingual widths (content-based)",
  render: function Render() {
    const [val, setVal] = React.useState("30d");
    return (
      <div lang="ko">
        {/* Segment widths from content — "지난 30일" must fit without truncation. */}
        <SegmentedControl
          aria-label="기간"
          options={[
            { value: "7d", label: "지난 7일" },
            { value: "30d", label: "지난 30일" },
            { value: "90d", label: "지난 90일" },
          ]}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "Disabled (whole control only)",
  render: () => (
    // The spec forbids disabling individual segments — the prop is control-level only.
    <SegmentedControl
      aria-label="Chart period"
      disabled
      options={[
        { value: "1d", label: "1D" },
        { value: "7d", label: "7D" },
        { value: "30d", label: "30D" },
      ]}
      defaultValue="7d"
    />
  ),
};
