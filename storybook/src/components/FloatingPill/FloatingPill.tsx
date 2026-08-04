import React, { forwardRef } from "react";
import "./FloatingPill.css";

export interface FloatingPillProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Single form. `rail` was declared and removed on 2026-08-03 with its only consumer
   * (ResponseToolbar's media rail) — kept as a one-member union so the class contract
   * stays explicit rather than implicit.
   */
  variant?: "horizontal";
  children?: React.ReactNode;
}

/**
 * FloatingPill — components.md · FloatingPill.
 *
 * The shared shell for a small transient action affordance: raised by a
 * condition, gone when it ends. A SURFACE primitive — it owns the shell, its
 * consumers own the behaviour.
 *
 * Declared 2026-08-03 after this exact anatomy turned up implemented three
 * times (SelectionPill, Thread's jump-to-latest, and ResponseToolbar's media rail —
 * the last since retired)
 * and specified nowhere — one of the three citing Toast, which shares the
 * tokens and none of the behaviour.
 *
 * Positioning is the CONSUMER's job, not this component's: the spec requires
 * anchoring to whatever raised the pill, never to the viewport, so there is no
 * `position` prop to get wrong.
 *
 * Every child must be a real control. A pill rendered as a <span> is a defect:
 * these affordances are often the only path to the action they carry.
 */
export const FloatingPill = forwardRef<HTMLDivElement, FloatingPillProps>(function FloatingPill(
  { variant = "horizontal", className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={["sy-fpill", `sy-fpill--${variant}`, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
});

/** The 1px border.default separator between actions. Decorative. */
export function FloatingPillSeparator() {
  return <span className="sy-fpill__sep" aria-hidden="true" />;
}
