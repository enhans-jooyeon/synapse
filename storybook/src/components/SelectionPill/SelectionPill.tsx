import React, { forwardRef } from "react";
import { FloatingPill, FloatingPillSeparator } from "../FloatingPill/FloatingPill";
import "./SelectionPill.css";

/**
 * The closed action set — THREE. Ruling 2026-08-03: ai-patterns §22's earlier
 * "never a third pill action" was stale and struck; §18's set is law.
 * Extending this requires governance (proposals/2026-08-03-chat-interface-component-gaps.md §4.1).
 */
export type SelectionAction = "reply" | "explain" | "regenerate";
export const SELECTION_ACTIONS: readonly SelectionAction[] = ["reply", "explain", "regenerate"] as const;

const ICONS: Record<SelectionAction, React.ReactNode> = {
  reply: <><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></>,
  explain: <><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 16v.01" /><path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" /></>,
  regenerate: <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />,
};

export interface SelectionPillProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Per-locale labels, keyed by action. */
  labels: Record<SelectionAction, string>;
  onAction: (action: SelectionAction) => void;
  onDismiss?: () => void;
}

/**
 * SelectionPill — components.md · SelectionPill · ai-patterns.md §18, §22.
 *
 * Composes FloatingPill (components.md · FloatingPill) for the shell — this component owns
 * only WHICH actions exist and where they apply. ONE pill, never a toolbar of options. The action set is closed and is not a
 * prop — a caller cannot add a fourth action or drop one, because both would
 * change a closed set without governance.
 *
 * Jurisdiction: agent Messages only. Selecting text in a human bubble raises
 * nothing — a user's own words need no reply affordance.
 */
export const SelectionPill = forwardRef<HTMLDivElement, SelectionPillProps>(function SelectionPill(
  { labels, onAction, onDismiss, className, ...rest },
  ref
) {
  return (
    <FloatingPill
      ref={ref}
      className={["sy-selpill", className].filter(Boolean).join(" ")}
      onKeyDown={(e) => { if (e.key === "Escape") onDismiss?.(); }}
      {...rest}
    >
      {SELECTION_ACTIONS.map((action, i) => (
        <React.Fragment key={action}>
          {i > 0 && <FloatingPillSeparator />}
          <button type="button" onClick={() => onAction(action)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[action]}</svg>
            {labels[action]}
          </button>
        </React.Fragment>
      ))}
    </FloatingPill>
  );
});
