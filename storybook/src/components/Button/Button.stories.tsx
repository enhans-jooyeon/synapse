import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import type { ButtonStyle, ButtonTarget } from "./Button";

/**
 * Spec: components.md · Button (two-axis, 2026-07-30; last synced 2026-08-05).
 * SYNC partner of Button.tsx / Button.css — the stories exercise the closed lists:
 * the full 12-cell buttonStyle × target matrix, the four sizes (xs inline-only),
 * disabled across all four styles (showing the 2026-08-03 ghost carve-out), and loading.
 *
 * Gallery caveat: jurisdiction rules (max 1 primary per region, max 1 brand per screen,
 * solid destructive = confirmation-only) are deliberately violated here — a matrix story
 * is a specimen sheet, not a screen.
 */
const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Save changes", buttonStyle: "secondary", target: "default", size: "md" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const STYLES: readonly ButtonStyle[] = ["primary", "secondary", "outline", "ghost"];
const TARGETS: readonly ButtonTarget[] = ["default", "destructive", "brand"];

/** Verb-first EN labels per content.md §3.2 — destructive cells get a delete verb. */
const LABEL: Record<ButtonTarget, string> = {
  default: "Save changes",
  destructive: "Delete file",
  brand: "Ask agent",
};

export const Playground: Story = {};

export const Matrix: Story = {
  name: "Two-axis matrix (all 12 cells)",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "max-content repeat(4, max-content)",
        gap: "var(--sy-space-3)",
        alignItems: "center",
      }}
    >
      <span />
      {STYLES.map((s) => (
        <span key={s} style={{ font: "var(--sy-weight-medium) var(--sy-text-12)/var(--sy-text-12-lh) var(--sy-font-sans)", color: "var(--sy-text-tertiary)" }}>
          {s}
        </span>
      ))}
      {TARGETS.map((t) => (
        <React.Fragment key={t}>
          <span style={{ font: "var(--sy-weight-medium) var(--sy-text-12)/var(--sy-text-12-lh) var(--sy-font-sans)", color: "var(--sy-text-tertiary)" }}>
            {t}
          </span>
          {STYLES.map((s) => (
            <Button key={`${s}-${t}`} buttonStyle={s} target={t}>
              {LABEL[t]}
            </Button>
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sy-space-4)", alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: "var(--sy-space-3)", alignItems: "center" }}>
        <Button size="sm">Save changes</Button>
        <Button size="md">Save changes</Button>
        <Button size="lg">Save changes</Button>
      </div>
      {/* xs is INLINE-ONLY (WCAG 2.5.8 Inline exception) — shown in its one sanctioned
          placement, inside a sentence; never toolbars/footers/forms. */}
      <p style={{ font: "var(--sy-weight-regular) var(--sy-body-size)/var(--sy-body-lh) var(--sy-font-sans)", margin: 0 }}>
        The run failed twice — <Button size="xs">View log</Button> — before recovering on its own.
      </p>
      <div lang="ko" style={{ display: "flex", gap: "var(--sy-space-3)" }}>
        <Button size="md">변경사항 저장</Button>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled (ghost carve-out)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-3)", alignItems: "center" }}>
      <Button buttonStyle="primary" disabled>Save changes</Button>
      <Button buttonStyle="secondary" disabled>Save changes</Button>
      <Button buttonStyle="outline" disabled>Save changes</Button>
      {/* 2026-08-03 carve-out: NO grey fill on ghost — the fill was one step per channel from
          ghost's own hover surface. The muted label alone carries the state (and must never be
          the only channel in real UI). */}
      <Button buttonStyle="ghost" disabled>Save changes</Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-3)", alignItems: "center" }}>
      {/* Spinner replaces the leading icon; the label stays; aria-busy is set and the
          aria-label (where one exists) persists unchanged. Width must not change. */}
      <Button buttonStyle="primary" loading>Saving…</Button>
      <Button
        buttonStyle="secondary"
        loading
        icon={
          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: "none", stroke: "currentColor", strokeWidth: 2 }}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        }
      >
        Add source
      </Button>
      {/* Icon-only: the spinner replaces the glyph itself; the square keeps width trivially. */}
      <Button
        buttonStyle="ghost"
        iconOnly
        loading
        aria-label="Refresh"
      />
    </div>
  ),
};

export const PillHeroOnly: Story = {
  name: "Pill (Guided heroes only)",
  render: () => (
    <div style={{ display: "flex", gap: "var(--sy-space-3)" }}>
      {/* Pill: primary + lg ONLY, Guided heroes / empty-state first-use, target default or
          brand — never destructive, never smaller sizes, never other styles. */}
      <Button buttonStyle="primary" size="lg" pill lang="ko">에이전트 만들기</Button>
      <Button buttonStyle="primary" target="brand" size="lg" pill>Ask agent</Button>
    </div>
  ),
};
