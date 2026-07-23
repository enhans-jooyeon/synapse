import React, { forwardRef } from "react";
import "./Card.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `flat` is the default: grouping by surface step, not boxes. */
  variant?: "flat" | "outlined" | "elevated" | "ai";
  /** Selection ring — key color; focus stays blue. */
  selected?: boolean;
  /**
   * Whole-card clickability. SPEC: interactive implies `outlined` or `elevated`
   * (clickability needs an edge) — enforced here by upgrading `flat`.
   */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "flat", selected = false, interactive = false, className, children, ...rest },
  ref
) {
  const effective = interactive && variant === "flat" ? "outlined" : variant;
  const cls = [
    "sy-card",
    `sy-card--${effective}`,
    selected && "sy-card--selected",
    interactive && "sy-card--interactive",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const interactiveProps = interactive ? { role: "button", tabIndex: 0 } : {};
  return (
    <div ref={ref} className={cls} {...interactiveProps} {...rest}>
      {children}
    </div>
  );
});
