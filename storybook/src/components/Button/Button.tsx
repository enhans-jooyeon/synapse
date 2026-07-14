import React, { forwardRef } from "react";
import "./Button.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** components.md · Button. `accent` = conversational-AI entry ONLY (Ask agent / Composer send), max one per screen. Operational agent actions (Run/Retry/Resume) use primary/secondary — executing an agent never earns blue (hard rule 7, v6.2.1). */
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  /**
   * Pill silhouette — JURISDICTION: Guided-archetype heroes and empty-state
   * first-use only. Never in forms, toolbars, tables, or dense regions.
   */
  pill?: boolean;
  /** Loading keeps width: the spinner joins the label, the label never leaves. */
  loading?: boolean;
  /**
   * Leading icon — policy v5.0.3: text-only is the default. Permitted only for
   * accent AI actions and toolbar/filter contexts with registry icons.
   */
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", pill = false, loading = false, icon, className, children, disabled, ...rest },
  ref
) {
  const cls = [
    "sy-btn",
    `sy-btn--${variant}`,
    size !== "md" && `sy-btn--${size}`,
    pill && "sy-btn--pill",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button ref={ref} className={cls} disabled={disabled} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="sy-btn__spinner" aria-hidden /> : icon}
      {children}
    </button>
  );
});
