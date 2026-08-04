import React, { forwardRef } from "react";
import "./AnswerHeader.css";

export interface AnswerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** From the run's stated goal. The §20 working line resolves into this string. */
  title: string;
  /** ACTUAL elapsed time, never an estimate (§11). Pre-formatted, e.g. "12.4s". */
  duration?: string;
  expanded: boolean;
  onToggle: (next: boolean) => void;
  /** VariantPager, when the reply holds more than one variant. */
  pager?: React.ReactNode;
  toggleLabel?: (expanded: boolean) => string;
}

/**
 * AnswerHeader — components.md · AnswerHeader · ai-patterns.md §20.
 *
 * ONE per reply — never per section. Title is `heading-sm`; agent text never
 * produces page-level hierarchy (§12), so there is no size prop. There is
 * deliberately no `defaultExpanded`/`autoCollapse`: collapsing a reply the user
 * did not collapse is forbidden, so the state is the caller's to persist.
 */
export const AnswerHeader = forwardRef<HTMLDivElement, AnswerHeaderProps>(function AnswerHeader(
  {
    title,
    duration,
    expanded,
    onToggle,
    pager,
    toggleLabel = (e) => (e ? "Collapse answer" : "Expand answer"),
    className,
    ...rest
  },
  ref
) {
  return (
    <div ref={ref} className={["sy-answerh", className].filter(Boolean).join(" ")} {...rest}>
      <span className="sy-answerh__title">{title}</span>
      {duration && <span className="sy-answerh__duration">{duration}</span>}
      <span className="sy-answerh__trailing">
        {pager}
        <button
          type="button"
          className="sy-answerh__toggle"
          aria-expanded={expanded}
          aria-label={toggleLabel(expanded)}
          onClick={() => onToggle(!expanded)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ transform: expanded ? "rotate(180deg)" : undefined }}>
            <path d="M6 9l6 6l6 -6" />
          </svg>
        </button>
      </span>
    </div>
  );
});
