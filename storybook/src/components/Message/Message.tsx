import React, { forwardRef } from "react";
import "./Message.css";

/** The squared agent avatar — the agency marker (ai-patterns §1). */
function AgentAvatar({ glyph }: { glyph?: React.ReactNode }) {
  return (
    <span className="sy-msg__avatar" aria-hidden="true">
      {glyph ?? (
        <svg viewBox="0 0 24 24">
          <path d="M12 5l1.8 5.2L19 12l-5.2 1.8L12 19l-1.8-5.2L5 12l5.2-1.8z" />
        </svg>
      )}
    </span>
  );
}

export interface MessageProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Closed set. There is no third actor form: system = Banner, handoff = §16 event. */
  variant: "human" | "agent";
  /** Accessible name for the turn — the actor. Required: a turn must be traceable. */
  actor: string;
  /** `agent` only — overrides the default agent glyph. */
  avatarGlyph?: React.ReactNode;
  state?: "sent" | "send-failed" | "streaming" | "settled" | "stopped" | "failed" | "guardrail-blocked";
  /** `human` only — document ContextCards, rendered ABOVE images and text (§12). */
  documents?: React.ReactNode;
  /** `human` only — image attachments, rendered between documents and text (§12). */
  images?: React.ReactNode;
  /** Caption under a stopped/failed reply ("Stopped by you"). */
  caption?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Message — components.md · Message · ai-patterns.md §12.
 *
 * The bubble/no-bubble asymmetry between the two variants is load-bearing: it is
 * the shape channel that makes authorship scannable without reading. Do not
 * "tidy" the two forms into matching containers.
 *
 * The agent content column has a FIXED element order (working line → steps →
 * reasoning → answer header → body → sources → proposal → media → toolbar →
 * chips). Callers may omit any element; they may not reorder them. This
 * component does not enforce that ordering — it cannot see semantic slots — so
 * the assembled Chat story is the reference composition.
 */
export const Message = forwardRef<HTMLElement, MessageProps>(function Message(
  { variant, actor, avatarGlyph, state, documents, images, caption, className, children, ...rest },
  ref
) {
  const cls = ["sy-msg", `sy-msg--${variant}`, state && `sy-msg--${state}`, className]
    .filter(Boolean)
    .join(" ");

  if (variant === "human") {
    // No avatar, no timestamp at rest, no toolbar — position and fill identify
    // the author, and ResponseToolbar is agent-only jurisdiction.
    return (
      <article ref={ref} className={cls} aria-label={actor} {...rest}>
        {documents && <div className="sy-msg__docs">{documents}</div>}
        {images && <div className="sy-msg__images">{images}</div>}
        <div className="sy-msg__bubble">{children}</div>
        {caption && <div className="sy-msg__caption">{caption}</div>}
      </article>
    );
  }

  return (
    <article ref={ref} className={cls} aria-label={actor} {...rest}>
      <AgentAvatar glyph={avatarGlyph} />
      <div className="sy-msg__content">
        {children}
        {caption && <div className="sy-msg__caption">{caption}</div>}
      </div>
    </article>
  );
});
