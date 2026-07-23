import React from "react";
import "./Badge.css";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Status vocabulary is the closed set in content.md §3.3. */
  color?: "neutral" | "info" | "success" | "warning" | "danger" | "ai";
  /**
   * Solid has named jobs only (components.md): urgent marks, ops-table opt-in,
   * neutral = release markers (must expire), ai = live-activity beacon.
   * `dot` renders as a plain dot+text row — compose it inline, not here.
   */
  emphasis?: "subtle" | "solid" | "outline";
  /** One shape per view. `rounded` defaults in dense/code-adjacent contexts. */
  shape?: "pill" | "rounded";
  /** `lg` only beside heading-xl+ titles (R1) and heroes — never in tables. */
  size?: "md" | "lg";
  /** with-icon: the matching 12px registry status icon — triple redundancy. */
  icon?: React.ReactNode;
}

export function Badge({
  color = "neutral", emphasis = "subtle", shape = "pill", size = "md",
  icon, className, children, ...rest
}: BadgeProps) {
  const cls = [
    "sy-badge",
    `sy-badge--${color}`,
    emphasis !== "subtle" && `sy-badge--${emphasis}`,
    shape === "rounded" && "sy-badge--rounded",
    size === "lg" && "sy-badge--lg",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} {...rest}>
      {icon}
      {children}
    </span>
  );
}
