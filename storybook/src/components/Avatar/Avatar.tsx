import React, { forwardRef } from "react";
import "./Avatar.css";

/**
 * Avatar — user/agent identity. Shape alone must scan authorship: `full` radius for
 * humans, squared (`sm` radius) for agents — mandatory product language.
 *
 * @input    components.md · "## Avatar" (the contract — edit it FIRST, this file follows)
 * @input    tokens/synapse.css (--sy-viz-* deterministic palette, status solids, bg/border)
 * @output   <span role="img"> carrying `.sy-avatar` classes (+ AvatarGroup);
 *           exported through storybook/src/index.ts
 * @position storybook/src/components/Avatar — React projection of the spec; the prose spec,
 *           not this file, is the review standard (adoption ruling #5, 2026-08-05)
 *
 * SYNC: these files must update together —
 *   - components.md · "## Avatar"                        (the contract; source of every rule below)
 *   - storybook/src/components/Avatar/Avatar.css         (sizes, shapes, dots, group stack)
 *   - storybook/src/components/Avatar/Avatar.stories.tsx (stories exercise the closed lists)
 *   - storybook/src/index.ts                             (export surface: Avatar, AvatarGroup + prop types)
 *
 * Last synced spec: components.md · "## Avatar" — 2026-08-05
 *   (Sizes slot ratified: 20/24/32/40/56 · dots per size 8/10/12/14, 20 NEVER dotted ·
 *    one status vocabulary per surface · AvatarGroup max 4 + "+N", humans first ·
 *    FLAGGED provisional readings recorded in
 *    proposals/2026-08-05-batch1-implementation-ambiguities.md — NOT resolved)
 */

/** Closed size set (ratified Sizes slot). 20 = dense table cells / inline mentions; 56 = profile surfaces. */
export type AvatarSize = 20 | 24 | 32 | 40 | 56;
/** Shape encodes authorship: humans are circles (`full`), agents are squared (`sm` 8). */
export type AvatarKind = "human" | "agent";
/**
 * One status vocabulary per product surface — never both meanings in one view.
 * Humans: presence — `active` (status.success-bg-solid) · `away` (border.strong).
 * Agents: run state — `running` (status.info-bg-solid, pulsing) · `failed`
 * (status.danger-bg-solid) · idle = no dot (omit the prop).
 */
export type AvatarStatus = "active" | "away" | "running" | "failed";

const HUMAN_STATUSES: readonly AvatarStatus[] = ["active", "away"];
const HANGUL = /[가-힣]/;

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Accessible name; also drives the initials and the deterministic viz hue. */
  name: string;
  /** Image source. Without it, initials render on the deterministic viz tint. */
  src?: string;
  /** Default `"human"` — FLAGGED provisional (the spec names no default). */
  kind?: AvatarKind;
  /** Default `32` — FLAGGED provisional (the spec names no default). */
  size?: AvatarSize;
  /**
   * Optional status dot, bottom-right, 2px `bg.page` ring, sized per avatar
   * (24→8 · 32→10 · 40→12 · 56→14). The 20px avatar NEVER carries a dot (illegible —
   * surface the state elsewhere in the row): a `status` at size 20 is ignored.
   * Use the vocabulary matching `kind` (see AvatarStatus).
   */
  status?: AvatarStatus;
  /**
   * Localized status text appended to the accessible name ("Jia Lee, away" /
   * "이지아, 자리 비움") — the dot is color-only, so the state must also be text.
   */
  statusLabel?: string;
}

/**
 * Deterministic viz assignment — same name, same hue, every render and session.
 * FLAGGED provisional: the spec requires "deterministic" but names no hash; a char-code
 * polynomial mod 8 over the 8-step viz palette is the implemented reading.
 */
function vizIndex(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 997;
  return (h % 8) + 1; // --sy-viz-1 … --sy-viz-8
}

/** 2 Latin letters (first + last word) / 1 Hangul syllable (spec). */
function initialsOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  if (HANGUL.test(trimmed)) {
    const syllable = trimmed.match(HANGUL);
    return syllable ? syllable[0] : trimmed.charAt(0);
  }
  const words = trimmed.split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

let warnedDotAt20 = false;
let warnedVocabulary = false;

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, kind = "human", size = 32, status, statusLabel, className, ...rest },
  ref
) {
  const isHumanStatus = status != null && HUMAN_STATUSES.includes(status);
  if (status != null && (kind === "human") !== isHumanStatus && !warnedVocabulary) {
    warnedVocabulary = true;
    // eslint-disable-next-line no-console
    console.warn(
      `[synapse] Avatar status "${status}" belongs to the ${isHumanStatus ? "human presence" : "agent run-state"} ` +
        `vocabulary but kind is "${kind}" — one vocabulary per surface (components.md · Avatar).`
    );
  }
  if (status != null && size === 20 && !warnedDotAt20) {
    warnedDotAt20 = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[synapse] Avatar: the 20px avatar NEVER carries a status dot (illegible at that scale — " +
        "components.md · Avatar). The dot is not rendered; surface the state elsewhere in the row."
    );
  }
  const showDot = status != null && size !== 20;

  const cls = [
    "sy-avatar",
    `sy-avatar--${size}`,
    `sy-avatar--${kind}`,
    !src && `sy-avatar--viz-${vizIndex(name)}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      ref={ref}
      className={cls}
      role="img"
      aria-label={statusLabel ? `${name}, ${statusLabel}` : name}
      {...rest}
    >
      {src ? (
        <img className="sy-avatar__img" src={src} alt="" />
      ) : (
        <span className="sy-avatar__initials" aria-hidden="true">
          {initialsOf(name)}
        </span>
      )}
      {showDot && <span className={`sy-avatar__dot sy-avatar__dot--${status}`} />}
    </span>
  );
});

/* ------------------------------------------------------------------ AvatarGroup */

/** Spec cap — max 4 visible, then the "+N" overflow circle. */
export const MAX_GROUP_VISIBLE = 4;

export interface AvatarGroupItem extends Pick<AvatarProps, "name" | "src" | "kind"> {}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Humans and agents may mix; rendering reorders humans first, then agents (spec). */
  items: AvatarGroupItem[];
  /** One size for the whole stack. */
  size?: AvatarSize;
  /**
   * The spec's "+N" click opens a Popover listing ALL members — Popover is not in the
   * library yet (FLAGGED): the overflow circle renders as a <button> wired to this
   * handler so a consumer can attach the listing; without it, a static circle.
   */
  onOverflowClick?: () => void;
  /** Accessible name for the overflow circle, localized by the consumer. */
  overflowLabel?: (hidden: number, total: number) => string;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  {
    items,
    size = 32,
    onOverflowClick,
    overflowLabel = (hidden, total) => `${hidden} more, ${total} total`,
    className,
    ...rest
  },
  ref
) {
  // Ordering is humans first, then agents (spec); the sort is stable within each kind.
  const ordered = [...items].sort(
    (a, b) => Number((a.kind ?? "human") === "agent") - Number((b.kind ?? "human") === "agent")
  );
  const visible = ordered.slice(0, MAX_GROUP_VISIBLE);
  const hidden = ordered.length - visible.length;
  const overflowCls = `sy-avatar-group__overflow sy-avatar-group__overflow--${size}`;

  return (
    <div ref={ref} className={["sy-avatar-group", className].filter(Boolean).join(" ")} {...rest}>
      {visible.map((item) => (
        <Avatar key={item.name} size={size} {...item} />
      ))}
      {/* NEVER hide the overflow count (spec Forbidden). */}
      {hidden > 0 &&
        (onOverflowClick ? (
          <button
            type="button"
            className={overflowCls}
            aria-label={overflowLabel(hidden, ordered.length)}
            onClick={onOverflowClick}
          >
            +{hidden}
          </button>
        ) : (
          <span className={overflowCls}>+{hidden}</span>
        ))}
    </div>
  );
});
