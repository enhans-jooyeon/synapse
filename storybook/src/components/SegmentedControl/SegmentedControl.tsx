import React, { forwardRef, useRef, useState } from "react";
import "./SegmentedControl.css";

/**
 * SegmentedControl — exclusive switch between 2–5 peer views/parameters with IMMEDIATE
 * effect (chart periods, layout toggles). Not Tabs (object facets), not Radio (form data,
 * deferred effect); never navigation or form submission.
 *
 * @input    components.md · "## SegmentedControl" (the contract — edit it FIRST, this file follows)
 * @input    tokens/synapse.css (--sy-bg-sunken, --sy-radius-tray/nested, text/border, ring tokens)
 * @output   <div role="radiogroup"> of <button role="radio"> carrying `.sy-segctl` classes;
 *           exported through storybook/src/index.ts
 * @position storybook/src/components/SegmentedControl — React projection of the spec; the
 *           prose spec, not this file, is the review standard (adoption ruling #5, 2026-08-05)
 *
 * SYNC: these files must update together —
 *   - components.md · "## SegmentedControl"                    (the contract)
 *   - storybook/src/components/SegmentedControl/SegmentedControl.css (geometry, states)
 *   - storybook/src/components/SegmentedControl/SegmentedControl.stories.tsx
 *   - storybook/src/index.ts                                   (SegmentedControl, prop types, MAX_SEGMENTS)
 *
 * Last synced spec: components.md · "## SegmentedControl" — 2026-08-05
 *   (concentric geometry corrected by SY021 2026-08-03: radius tray 12 − 4px inner padding
 *    = nested 8 · radiogroup semantics, arrow keys move selection · disabled whole-control
 *    only · FLAGGED provisional readings — including the entry's own 32-vs-36 assembled-
 *    height contradiction — recorded in
 *    proposals/2026-08-05-batch1-implementation-ambiguities.md — NOT resolved)
 */

export interface SegmentedControlOption {
  value: string;
  /** Always required — it is the segment text, or the `aria-label` when `iconOnly`. */
  label: string;
  /** 16px registry icon. Approved-list icons only (review-enforced). */
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * 2–5 segments (closed range; >5 → Select). Mixing icon+text and text-only segments in
   * one control is forbidden — homogeneity comes from the control-level `iconOnly` flag.
   */
  options: SegmentedControlOption[];
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value; defaults to the first option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** All segments render their `icon` only, with `label` as each segment's aria-label. */
  iconOnly?: boolean;
  /** WHOLE control only — the spec forbids disabling individual segments. */
  disabled?: boolean;
}

/** Spec cap — 2–5 segments; beyond five, use Select. */
export const MAX_SEGMENTS = 5;

let warnedRange = false;

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { options, value, defaultValue, onChange, iconOnly = false, disabled = false, className, ...rest },
    ref
  ) {
    const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? "");
    const current = value !== undefined ? value : internal;
    const segRefs = useRef<Array<HTMLButtonElement | null>>([]);

    if ((options.length < 2 || options.length > MAX_SEGMENTS) && !warnedRange) {
      warnedRange = true;
      // eslint-disable-next-line no-console
      console.warn(
        `[synapse] SegmentedControl holds 2–${MAX_SEGMENTS} segments (components.md · SegmentedControl); ` +
          `got ${options.length}. Beyond five, use Select.`
      );
    }

    const select = (next: string, focusIndex?: number) => {
      if (disabled || next === current) return;
      if (value === undefined) setInternal(next);
      onChange?.(next);
      if (focusIndex !== undefined) segRefs.current[focusIndex]?.focus();
    };

    /**
     * Roving tabindex (foundations §9): one Tab stop, arrow keys MOVE SELECTION (the spec's
     * words — selection follows focus, matching the radiogroup pattern). Ends wrap — FLAGGED
     * provisional (unstated; ARIA radiogroup arrow behavior taken).
     */
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const delta =
        e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 :
        e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (delta === 0) return;
      e.preventDefault();
      const i = options.findIndex((o) => o.value === current);
      const next = (i + delta + options.length) % options.length;
      select(options[next].value, next);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={["sy-segctl", disabled && "sy-segctl--disabled", className].filter(Boolean).join(" ")}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {options.map((opt, i) => {
          const selected = opt.value === current;
          return (
            <button
              key={opt.value}
              ref={(el) => { segRefs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={iconOnly ? opt.label : undefined}
              // Disabled regions are not focusable (foundations §9) — native disabled does both.
              disabled={disabled}
              tabIndex={selected ? 0 : -1}
              className={[
                "sy-segctl__seg",
                selected && "sy-segctl__seg--selected",
                iconOnly && "sy-segctl__seg--icon",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => select(opt.value)}
            >
              {iconOnly ? opt.icon : (
                <>
                  {opt.icon}
                  {opt.label}
                </>
              )}
            </button>
          );
        })}
      </div>
    );
  }
);
