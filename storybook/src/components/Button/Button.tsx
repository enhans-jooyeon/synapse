import React, { forwardRef } from "react";
import "./Button.css";

/**
 * Button — the two-axis Synapse Button (`buttonStyle` × `target`).
 *
 * @input    components.md · "## Button" (the contract — edit it FIRST, this file follows)
 * @input    tokens/synapse.css (--sy-action-*, --sy-control-*, --sy-radius-control-*, ring + status tokens)
 * @output   <button> carrying `.sy-btn` classes; exported through storybook/src/index.ts
 * @position storybook/src/components/Button — React projection of the spec; the prose spec,
 *           not this file, is the review standard (adoption ruling #5, 2026-08-05)
 *
 * SYNC: these files must update together —
 *   - components.md · "## Button"                       (the contract; source of every rule below)
 *   - storybook/src/components/Button/Button.css        (12-cell matrix, sizes, rings, states)
 *   - storybook/src/components/Button/Button.stories.tsx (stories exercise the closed lists)
 *   - storybook/src/index.ts                            (export surface: Button, ButtonProps)
 *
 * Last synced spec: components.md · "## Button" — 2026-08-05
 *   (two-axis API of 2026-07-30 · soft/strong focus rings 2026-07-30 · pressed state dropped
 *    2026-07-30 · danger weight compensation retired 2026-07-30 · ghost disabled carve-out
 *    2026-08-03 · azure brand hover azure.550 2026-07-31 · per-size radius + padding ladder
 *    2026-07-30/31 · six provisional readings RATIFIED 2026-08-05,
 *    proposals/2026-08-05-button-implementation-ambiguities.md — nothing here is flagged anymore)
 *
 * NOT yet implemented from the spec: the `render`/`asChild` polymorphic slot (framework
 * routing). Out of the 2026-08-05 hygiene scope; tracked for the parity build-out.
 */

/** Axis 1 — emphasis ("how loud"). */
export type ButtonStyle = "primary" | "secondary" | "outline" | "ghost";
/** Axis 2 — intent ("what kind"). Hue lives here; behaviour never does. */
export type ButtonTarget = "default" | "destructive" | "brand";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

/** @deprecated v1 single-axis API — see LEGACY_VARIANT_MAP. Removed at the next major. */
export type LegacyButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "brand";

/**
 * TEMPORARY compatibility shim (deprecated 2026-08-05, removed at the next major).
 * Old single-axis `variant` → two-axis (`buttonStyle`, `target`):
 *   primary   → primary   × default
 *   secondary → secondary × default
 *   ghost     → ghost     × default
 *   danger    → primary   × destructive
 *   brand     → primary   × brand
 */
const LEGACY_VARIANT_MAP: Record<LegacyButtonVariant, { buttonStyle: ButtonStyle; target: ButtonTarget }> = {
  primary: { buttonStyle: "primary", target: "default" },
  secondary: { buttonStyle: "secondary", target: "default" },
  ghost: { buttonStyle: "ghost", target: "default" },
  danger: { buttonStyle: "primary", target: "destructive" },
  brand: { buttonStyle: "primary", target: "brand" },
};

let warnedLegacyVariant = false;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Emphasis axis. `secondary` (tonal) is the standard choice; `primary` is capped at one
   * visible per region, counted regardless of `target`.
   * Default `"secondary"` — ratified 2026-08-05 (proposals/2026-08-05-button-implementation-
   * ambiguities.md): the spec now states the API defaults (secondary × default × md).
   */
  buttonStyle?: ButtonStyle;
  /**
   * Intent axis. `destructive` solid (primary × destructive) is destructive-confirmation-only;
   * `brand` is bright azure, max 1 per screen across ALL FOUR styles — operational agent
   * actions (Run/Retry/Resume) stay `default`.
   */
  target?: ButtonTarget;
  /**
   * `xs` is INLINE-ONLY (WCAG 2.5.8 Inline exception): sanctioned only inside a sentence or a
   * table cell's text flow. Never in toolbars, dialog footers, or form rows — runtime cannot
   * enforce placement, review must. When in doubt use `sm`. `lg` is heroes only.
   */
  size?: ButtonSize;
  /**
   * Spinner (registry `loader-circle`, rotated by CSS, at the size's icon size — 12 at `xs`,
   * 16 at `sm`–`lg`) replaces the leading icon — or, on an icon-only button, the glyph itself.
   * On a TEXT-ONLY button it prepends before the label; the width change there is the spec's
   * documented exception (ratified 2026-08-05 — "width never changes" holds wherever a leading
   * icon exists to replace). The label stays; `aria-busy` is set and any `aria-label` persists
   * unchanged (never relabel to "Loading").
   */
  loading?: boolean;
  /**
   * Square icon-only button (width = the size's control height). Approved glyphs only:
   * close, more (…), edit, delete, copy, refresh, expand/collapse, settings. MUST carry
   * `aria-label`. Pass the glyph as `children`.
   */
  iconOnly?: boolean;
  /**
   * Leading icon (16px; 12px at `xs`) — text-only is the default; permitted only for the
   * conversational-AI entry button and toolbar/filter contexts (registry icons).
   */
  icon?: React.ReactNode;
  /**
   * Trailing affordance icon — closed set: chevron-down (opens a menu), arrow-up-right
   * (opens externally), chevron-right (advances a step). Never decoration; one max.
   */
  trailingIcon?: React.ReactNode;
  /**
   * Pill silhouette — JURISDICTION (closed on both axes): `primary` + `lg` only, in
   * Guided-archetype heroes / empty-state first-use, `target` default or brand only.
   */
  pill?: boolean;
  /** @deprecated Use `buttonStyle` + `target`. Mapped via LEGACY_VARIANT_MAP; removed at the next major. */
  variant?: LegacyButtonVariant;
}

/** Registry `loader-circle` glyph (icons.md); rotation is CSS, the glyph itself is static. */
const Spinner = () => (
  <svg className="sy-btn__spinner" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    buttonStyle,
    target,
    size = "md",
    loading = false,
    iconOnly = false,
    icon,
    trailingIcon,
    pill = false,
    variant,
    className,
    children,
    disabled,
    ...rest
  },
  ref
) {
  if (variant !== undefined) {
    if (!warnedLegacyVariant) {
      warnedLegacyVariant = true;
      // eslint-disable-next-line no-console
      console.warn(
        '[synapse] Button `variant` is deprecated (superseded by the two-axis API, components.md · Button, 2026-07-30). ' +
          "Map: primary→primary/default · secondary→secondary/default · ghost→ghost/default · " +
          "danger→primary/destructive · brand→primary/brand. `variant` is removed at the next major."
      );
    }
    const legacy = LEGACY_VARIANT_MAP[variant];
    buttonStyle = buttonStyle ?? legacy.buttonStyle;
    target = target ?? legacy.target;
  }
  const style: ButtonStyle = buttonStyle ?? "secondary";
  const intent: ButtonTarget = target ?? "default";

  const hasLeading = !iconOnly && (loading || icon != null);
  const hasTrailing = !iconOnly && trailingIcon != null;

  const cls = [
    "sy-btn",
    `sy-btn--${style}`,
    intent !== "default" && `sy-btn--${intent}`,
    size !== "md" && `sy-btn--${size}`,
    iconOnly && "sy-btn--icon",
    hasLeading && "sy-btn--lead",
    hasTrailing && "sy-btn--trail",
    pill && "sy-btn--pill",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={cls} disabled={disabled} aria-busy={loading || undefined} {...rest}>
      {iconOnly ? (
        loading ? <Spinner /> : children
      ) : (
        <>
          {loading ? <Spinner /> : icon}
          {children}
          {trailingIcon}
        </>
      )}
    </button>
  );
});
