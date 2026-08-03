import React, { forwardRef, useState } from "react";
import "./ConversationSummary.css";

export interface ConversationSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Attribution is REQUIRED — a summary that reads as chrome is a provenance failure (§9). */
  agentName: string;
  timestamp: string;
  /** Generation age. A stale summary shows its age, never a false "current" (§34). */
  lastGenerated: string;
  onRefresh?: () => void;
  refreshLabel?: string;
  title?: string;
  children?: React.ReactNode;
}

/**
 * ConversationSummary — components.md · ConversationSummary · ai-patterns.md §34.
 *
 * It is agent output, marked as such: `ai.surface` fill plus the squared-avatar
 * attribution row, both required. Never system chrome, never the user's notes.
 *
 * Refreshable, not authoritative — it never replaces or rewrites the transcript.
 * Each point should link back to the turns it summarizes; a point that cannot
 * point at its source turns violates §10 honesty.
 */
export const ConversationSummary = forwardRef<HTMLDivElement, ConversationSummaryProps>(
  function ConversationSummary(
    { agentName, timestamp, lastGenerated, onRefresh, refreshLabel = "Regenerate summary", title, className, children, ...rest },
    ref
  ) {
    const [expanded, setExpanded] = useState(true);
    return (
      <div ref={ref} className={["sy-convsum", className].filter(Boolean).join(" ")} {...rest}>
        <div className="sy-convsum__head">
          <span className="sy-convsum__avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 5l1.8 5.2L19 12l-5.2 1.8L12 19l-1.8-5.2L5 12l5.2-1.8z" /></svg>
          </span>
          <span className="sy-convsum__actor">{agentName}</span>
          <span className="sy-convsum__meta">{timestamp}</span>
          {title && <span className="sy-convsum__title">{title}</span>}
          <span className="sy-convsum__trailing">
            <span className="sy-convsum__meta">{lastGenerated}</span>
            {onRefresh && (
              <button type="button" className="sy-convsum__btn" aria-label={refreshLabel} onClick={onRefresh}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" /></svg>
              </button>
            )}
            <button
              type="button"
              className="sy-convsum__btn"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse summary" : "Expand summary"}
              onClick={() => setExpanded((e) => !e)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ transform: expanded ? "rotate(180deg)" : undefined }}>
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>
          </span>
        </div>
        {expanded && <div className="sy-convsum__body">{children}</div>}
      </div>
    );
  }
);
