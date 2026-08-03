import React, { forwardRef, useState } from "react";
import "./Reasoning.css";

export interface ReasoningProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: string;
  /** Pre-formatted actual duration. */
  duration?: string;
  /**
   * Policy-suppressed. Renders the stated line — NEVER an empty region.
   * Pass the locale string; there is no English default worth hardcoding.
   */
  redactedNotice?: string;
  /** Controlled expansion. Persist per user per conversation (§14). */
  expanded?: boolean;
  onExpandedChange?: (next: boolean) => void;
  children?: React.ReactNode;
}

/**
 * Reasoning — components.md · Reasoning · ai-patterns.md §14.
 *
 * Three subordination rules are structural, not stylistic, and are enforced by
 * construction here:
 *
 * 1. Never `text.primary` — the CSS has no variant that could raise it.
 * 2. Never carries SourceChips — citations belong to claims in the ANSWER. This
 *    component takes no `sources` slot, so there is nowhere to put them.
 * 3. Excluded from copy/regenerate — it exposes no toolbar.
 *
 * There is deliberately NO `defaultExpanded` or `autoExpand` prop: auto-expand
 * is forbidden. Uncontrolled use starts collapsed, always.
 *
 * The expanded region is NOT a live region even while reasoning streams —
 * announcing working text over the answer inverts the subordination.
 */
export const Reasoning = forwardRef<HTMLDivElement, ReasoningProps>(function Reasoning(
  { label = "Reasoning", duration, redactedNotice, expanded, onExpandedChange, className, children, ...rest },
  ref
) {
  const [uncontrolled, setUncontrolled] = useState(false); // collapsed, always
  const isOpen = expanded ?? uncontrolled;
  const toggle = () => {
    const next = !isOpen;
    onExpandedChange ? onExpandedChange(next) : setUncontrolled(next);
  };

  return (
    <div ref={ref} className={["sy-reasoning", className].filter(Boolean).join(" ")} {...rest}>
      <button type="button" className="sy-reasoning__row" aria-expanded={isOpen} onClick={toggle}>
        <svg
          className="sy-reasoning__chev"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ transform: isOpen ? "rotate(90deg)" : undefined }}
        >
          <path d="M9 6l6 6l-6 6" />
        </svg>
        <span className="sy-reasoning__label">{label}</span>
        {duration && <span className="sy-reasoning__dur">{duration}</span>}
      </button>
      {isOpen && (
        <div className="sy-reasoning__body">
          {redactedNotice ? <span className="sy-reasoning__redacted">{redactedNotice}</span> : children}
        </div>
      )}
    </div>
  );
});
