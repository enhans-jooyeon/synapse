import React, { forwardRef } from "react";
import "./VariantPager.css";

export interface VariantPagerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 1-based index of the visible variant. */
  index: number;
  /** Retained variants. Spec caps this at 5; beyond that the oldest unpinned is replaced. */
  total: number;
  onChange: (nextIndex: number) => void;
  prevLabel?: (i: number, n: number) => string;
  nextLabel?: (i: number, n: number) => string;
}

/** Spec cap — max 5 retained variants (components.md · VariantPager). */
export const MAX_VARIANTS = 5;

/**
 * VariantPager — components.md · VariantPager · ai-patterns.md §22.
 *
 * Arrows DISABLE at the ends rather than wrapping, and the counter is a polite
 * live region so switching announces. Never expose variants as Tabs or a Select:
 * the pager is the closed form.
 */
export const VariantPager = forwardRef<HTMLDivElement, VariantPagerProps>(function VariantPager(
  {
    index,
    total,
    onChange,
    prevLabel = (i, n) => `Previous version, ${i} of ${n}`,
    nextLabel = (i, n) => `Next version, ${i} of ${n}`,
    className,
    ...rest
  },
  ref
) {
  if (total <= 1) return null; // a single variant has nothing to page through
  const atStart = index <= 1;
  const atEnd = index >= total;
  return (
    <div ref={ref} className={["sy-vpager", className].filter(Boolean).join(" ")} {...rest}>
      <button
        type="button"
        className="sy-vpager__arrow"
        disabled={atStart}
        aria-label={prevLabel(index - 1, total)}
        onClick={() => !atStart && onChange(index - 1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6l6 6" /></svg>
      </button>
      <span className="sy-vpager__count" aria-live="polite">{index}/{total}</span>
      <button
        type="button"
        className="sy-vpager__arrow"
        disabled={atEnd}
        aria-label={nextLabel(index + 1, total)}
        onClick={() => !atEnd && onChange(index + 1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6l-6 6" /></svg>
      </button>
    </div>
  );
});
