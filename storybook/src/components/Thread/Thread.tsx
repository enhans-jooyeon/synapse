import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { FloatingPill } from "../FloatingPill/FloatingPill";
import "./Thread.css";

export interface ThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label for the "Jump to latest" pill. Locale string — supply per locale. */
  jumpLabel?: string;
  /** Rendered at the top edge while older turns page in. */
  loadingHistory?: React.ReactNode;
}

/**
 * Thread — components.md · Thread · ai-patterns.md §2, §25.
 *
 * Owns the scroll contract, not the turns. Two rules are encoded here rather
 * than left to the caller because both are easy to get wrong:
 *
 * 1. The bottom lock releases the moment the user scrolls up and is NEVER
 *    re-acquired automatically while output streams (§2).
 * 2. `role="log"` + `aria-live="polite"` is declared ONCE here. Messages must
 *    not declare their own — nested live regions double-announce.
 */
export const Thread = forwardRef<HTMLDivElement, ThreadProps>(function Thread(
  { jumpLabel = "Jump to latest", loadingHistory, className, children, ...rest },
  ref
) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // 8px tolerance: sub-pixel scroll heights should not read as "scrolled up".
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight <= 8);
  }, []);

  useEffect(() => {
    // Stick to bottom ONLY while already at the bottom. Never re-acquire.
    if (!atBottom) return;
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [children, atBottom]);

  const jump = () => {
    const el = scrollerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div ref={ref} className={["sy-thread", className].filter(Boolean).join(" ")} {...rest}>
      <div className="sy-thread__scroller" ref={scrollerRef} onScroll={onScroll}>
        <div className="sy-thread__column" role="log" aria-live="polite">
          {loadingHistory}
          {children}
        </div>
      </div>
      {/* A FloatingPill, not a Toast — see components.md · Thread. Rendered only while the bottom
          lock is RELEASED, and the child is a real <button> per the FloatingPill contract. */}
      {!atBottom && (
        <FloatingPill className="sy-thread__jump">
          <button type="button" onClick={jump}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6l6 -6" /></svg>
            {jumpLabel}
          </button>
        </FloatingPill>
      )}
    </div>
  );
});
