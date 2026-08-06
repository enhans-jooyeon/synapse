import React, { forwardRef } from "react";
import "./Chip.css";

/**
 * Chip — the compact INTERACTIVE element (select, refine, remove, accept a suggestion).
 *
 * @input    components.md · "## Chip" (the contract — edit it FIRST, this file follows)
 * @input    tokens/synapse.css (border/bg/text tokens, --sy-bg-inverse-soft, ring tokens)
 * @output   <button>/<span> carrying `.sy-chip` classes; exported through storybook/src/index.ts
 * @position storybook/src/components/Chip — React projection of the spec; the prose spec,
 *           not this file, is the review standard (adoption ruling #5, 2026-08-05)
 *
 * SYNC: these files must update together —
 *   - components.md · "## Chip"                       (the contract; source of every rule below)
 *   - storybook/src/components/Chip/Chip.css          (variants, selection models, states)
 *   - storybook/src/components/Chip/Chip.stories.tsx  (stories exercise the closed lists)
 *   - storybook/src/index.ts                          (export surface: Chip, ChipProps)
 *
 * Last synced spec: components.md · "## Chip" — 2026-08-05
 *   (fill-encodes-interactivity 2026-07-30 · category variant RETIRED 2026-07-30 ·
 *    selection-model split: multi = no fill + border.selected, single = bg.inverse-soft ·
 *    FLAGGED provisional readings recorded in
 *    proposals/2026-08-05-batch1-implementation-ambiguities.md — NOT resolved)
 *
 * The Badge/Chip split is absolute: if it can be clicked it is a Chip; if it only informs
 * it is a Badge. A Chip is OUTLINED at rest (fill encodes interactivity, not shape).
 * Chips never carry commands (that is Button), never carry manual colors, never truncate.
 */

/** Closed variant set — `category` was RETIRED 2026-07-30 (label-only → Badge `category`). */
export type ChipVariant = "input" | "list-filter" | "suggestion";
/**
 * The selected treatment is decided by the SELECTION MODEL (spec, 2026-07-30):
 * `multi` — no fill: transparent + 1px `border.selected` + leading ✓ (a row of five
 * selected filters stays quiet); `single` — `bg.inverse-soft` fill + `text.on-inverse`
 * + leading ✓ (exactly one active chip may read loud; NOT `bg.inverse`, which is
 * byte-identical to `action.primary-bg` and would render as a primary button).
 */
export type ChipSelectionMode = "multi" | "single";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Closed set. `input` = removable selection (Combobox multi-values, recipients,
   * applied values); `list-filter` = toggleable refinement in filter bars/list headers;
   * `suggestion` = agent-suggested actions, console + empty states ONLY, max 3.
   * Never mix `input` and `list-filter` in one row (split into two rows).
   * Default `"input"` — FLAGGED provisional (the spec names no default; first row of
   * the closed variant table taken).
   */
  variant?: ChipVariant;
  /**
   * `input` only — the trailing 12px ✕ removes the chip; the chip BODY is not a second
   * target (it renders as a non-interactive <span>; only the ✕ is a <button>).
   */
  onRemove?: () => void;
  /**
   * `aria-label` for the remove ✕ — REQUIRED by the spec's A11y slot, localized:
   * "Remove" (EN) / "제거" (KO). The default is EN-only; a KO surface must pass "제거".
   */
  removeLabel?: string;
  /**
   * `input` only — leading Avatar when the value is a person or agent. The spec says
   * "Avatar 16", a size OUTSIDE Avatar's closed set (20/24/32/40/56) — FLAGGED; the
   * slot clamps whatever is passed to 16px.
   */
  avatar?: React.ReactNode;
  /** `list-filter` only — selected chips gain the leading 12px ✓ plus the model's treatment. */
  selected?: boolean;
  /**
   * `list-filter` only. Default `"multi"` — FLAGGED provisional (the spec names no
   * default; filter ROWS are the variant's lead use case and multi is the quiet one).
   */
  selectionMode?: ChipSelectionMode;
  /** `text.disabled` + `border.subtle`, no interaction — NEVER opacity (system-wide ban). */
  disabled?: boolean;
}

/** Registry `x` glyph (icons.md: "remove (from collection)" — also Chip/dismiss ✕), 12px. */
const XIcon = () => (
  <svg className="sy-chip__glyph" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 6 6 18" /> <path d="m6 6 12 12" />
  </svg>
);
/** Registry `check` glyph (icons.md: "approve / confirm"), 12px, leading on selected chips. */
const CheckIcon = () => (
  <svg className="sy-chip__glyph" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Chip = forwardRef<HTMLElement, ChipProps>(function Chip(
  {
    variant = "input",
    onRemove,
    removeLabel = "Remove",
    avatar,
    selected = false,
    selectionMode = "multi",
    disabled = false,
    className,
    children,
    ...rest
  },
  ref
) {
  const cls = [
    "sy-chip",
    `sy-chip--${variant === "list-filter" ? "filter" : variant}`,
    variant === "list-filter" && selected && "sy-chip--selected",
    variant === "list-filter" && selectionMode === "single" && "sy-chip--single",
    disabled && "sy-chip--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "input") {
    // The chip body is NOT a target (spec: "✕ removes; chip body is not a second target"),
    // so the container is a <span>; only the remove ✕ is interactive.
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={cls} {...rest}>
        {avatar != null && <span className="sy-chip__avatar">{avatar}</span>}
        <span className="sy-chip__label">{children}</span>
        <button
          type="button"
          className="sy-chip__remove"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
        >
          <XIcon />
        </button>
      </span>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={cls}
      disabled={disabled}
      // aria-pressed carries the toggle state on list-filter chips; suggestion chips are
      // plain buttons (they accept an action once, they do not toggle).
      aria-pressed={variant === "list-filter" ? selected : undefined}
      {...rest}
    >
      {variant === "list-filter" && selected && <CheckIcon />}
      <span className="sy-chip__label">{children}</span>
    </button>
  );
});
