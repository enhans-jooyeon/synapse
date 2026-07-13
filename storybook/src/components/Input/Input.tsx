import React, { forwardRef, useId } from "react";
import "./Input.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label is REQUIRED and renders above the field (KO/EN widths diverge). */
  label: string;
  /** Helper text; replaced by `error` when present. */
  helper?: string;
  /** Error text MUST name the fix, not just "invalid" (content.md §5). */
  error?: string;
  /** Affix slots (v6.0): one leading registry icon, one trailing unit/icon. */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, leading, trailing, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = `${inputId}-desc`;
  const cls = [
    "sy-field",
    error && "sy-field--error",
    leading && "sy-field--lead",
    trailing && "sy-field--trail",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      <label className="sy-field__label" htmlFor={inputId}>{label}</label>
      <div className="sy-field__ctrl">
        {leading && <span className="sy-field__affix sy-field__affix--lead" aria-hidden>{leading}</span>}
        <input
          ref={ref}
          id={inputId}
          className="sy-field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={helper || error ? descId : undefined}
          {...rest}
        />
        {trailing && <span className="sy-field__affix sy-field__affix--trail" aria-hidden>{trailing}</span>}
      </div>
      {(error || helper) && (
        <span className="sy-field__help" id={descId}>{error ?? helper}</span>
      )}
    </div>
  );
});
