import React, { forwardRef, useState } from "react";
import "./FollowUpPanel.css";

export interface FollowUpRow {
  /** Chip honesty: this label IS the query inserted. Never a hidden longer prompt. */
  label: string;
  /** refine = zoom in on the current answer; pivot = zoom out to a next step. */
  intent: "refine" | "pivot";
}

export interface FollowUpPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  rows: FollowUpRow[];
  /** Inserts into the Composer. NEVER auto-sends (§19). */
  onSelect: (row: FollowUpRow) => void;
  onDismiss?: () => void;
  /** Optional micro-label group headers, rendered only when both intents are present. */
  groupLabels?: { refine: string; pivot: string };
  /** Keycap hint row — decorative (aria-hidden); the real handlers are below. */
  keycapHint?: string;
}

/** Spec cap — max 4 rows total (components.md · FollowUpPanel). */
export const MAX_FOLLOWUP_ROWS = 4;

/**
 * FollowUpPanel — components.md · FollowUpPanel · ai-patterns.md §19.
 *
 * Anatomy was relocated to components.md on 2026-08-03; ai-patterns §19 keeps
 * the behavior rules.
 *
 * The panel is SOLID `bg.raised` — not glass. It is small, dense, and sits over
 * thread text where translucency reads muddy (foundations §6), and
 * `backdrop-filter` is gate-forbidden (SY015).
 *
 * Rows are capped at 4 and ordered refine-before-pivot. There is no per-row
 * rationale line: that would break chip honesty, since the label IS the query.
 * Grouping is how the panel signals why a row is offered.
 */
export const FollowUpPanel = forwardRef<HTMLDivElement, FollowUpPanelProps>(function FollowUpPanel(
  { rows, onSelect, onDismiss, groupLabels, keycapHint, className, ...rest },
  ref
) {
  const [active, setActive] = useState(0);

  // refine above pivot, ranked within group, hard-capped at 4.
  const ordered = [
    ...rows.filter((r) => r.intent === "refine"),
    ...rows.filter((r) => r.intent === "pivot"),
  ].slice(0, MAX_FOLLOWUP_ROWS);

  if (ordered.length === 0) return null;

  const hasBoth = ordered.some((r) => r.intent === "refine") && ordered.some((r) => r.intent === "pivot");
  const firstPivot = ordered.findIndex((r) => r.intent === "pivot");

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, ordered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); onSelect(ordered[active]); }
    else if (e.key === "Escape") { onDismiss?.(); }
  };

  return (
    <div
      ref={ref}
      className={["sy-fup", className].filter(Boolean).join(" ")}
      role="listbox"
      tabIndex={0}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {keycapHint && <div className="sy-fup__keys" aria-hidden="true">{keycapHint}</div>}
      {ordered.map((row, i) => (
        <React.Fragment key={`${row.intent}-${row.label}`}>
          {hasBoth && groupLabels && i === 0 && <div className="sy-fup__group">{groupLabels.refine}</div>}
          {hasBoth && i === firstPivot && <span className="sy-fup__divider" aria-hidden="true" />}
          {hasBoth && groupLabels && i === firstPivot && <div className="sy-fup__group">{groupLabels.pivot}</div>}
          <div
            className={["sy-fup__row", i === active && "sy-fup__row--sel"].filter(Boolean).join(" ")}
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => onSelect(row)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6" /></svg>
            {row.label}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
});
