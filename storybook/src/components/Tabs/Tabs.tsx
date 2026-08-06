import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./Tabs.css";

/**
 * Tabs — switch between peer views of the same object (2–7 tabs). Text tabs only:
 * boxed/pill styles are forbidden, sequential steps are a Stepper (recipes.md R9),
 * overflow scrolls with fade edges and never wraps.
 *
 * @input    components.md · "## Tabs" (the contract — edit it FIRST, this file follows)
 * @input    tokens/synapse.css (text/border/bg tokens, --sy-bg-inverse underline, ring tokens)
 * @output   <div> with a role="tablist" strip of role="tab" buttons carrying `.sy-tabs`
 *           classes; exported through storybook/src/index.ts
 * @position storybook/src/components/Tabs — React projection of the spec; the prose spec,
 *           not this file, is the review standard (adoption ruling #5, 2026-08-05)
 *
 * SYNC: these files must update together —
 *   - components.md · "## Tabs"                      (the contract; source of every rule below)
 *   - storybook/src/components/Tabs/Tabs.css         (strip, underline, editable states)
 *   - storybook/src/components/Tabs/Tabs.stories.tsx (stories exercise the closed lists)
 *   - storybook/src/index.ts                         (export surface: Tabs, TabsProps, TabItem, MAX_TABS)
 *
 * Last synced spec: components.md · "## Tabs" — 2026-08-05
 *   (`editable` variant 2026-07-30 · 7-tab cap: author tabs by review, editable by
 *    DISABLING the + at 7 · dirty = 6px text.tertiary dot replacing the ✕ until hover ·
 *    closing = fast width collapse · never close the last remaining tab ·
 *    FLAGGED provisional readings recorded in
 *    proposals/2026-08-05-batch1-implementation-ambiguities.md — NOT resolved)
 *
 * This component owns the STRIP only — panels belong to the page (FLAGGED reading; wire
 * `panelId` per item so each tab carries `aria-controls`, and give the panel
 * `role="tabpanel"` + `aria-labelledby` of the tab's id: `sy-tab-{id}`).
 */

export interface TabItem {
  id: string;
  label: string;
  /** Optional count Badge after the label — pass a composed <Badge>. */
  badge?: React.ReactNode;
  /** `editable` only — unsaved content: a 6px text.tertiary dot replaces the ✕ until hover. */
  dirty?: boolean;
  /** id of this tab's panel, wired into `aria-controls`. */
  panelId?: string;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 2–7 tabs. Author-defined sets are capped by review; `editable` caps by disabling the +. */
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  /**
   * USER-created tab sets only (open query/document/run workspaces) — if the user cannot
   * create the tab, they must not be able to close it (spec Forbidden). Adds the ✕ per
   * tab, the + after the last tab (outside the scroll region), Delete/Backspace-to-close
   * and double-click-to-rename.
   */
  editable?: boolean;
  /** `editable` — called after the closing collapse; the parent removes the item. */
  onClose?: (id: string) => void;
  /** `editable` — the + button. Disabled at 7 regardless (the cap is not optional). */
  onAdd?: () => void;
  /** `editable` — commit of a double-click inline rename. */
  onRename?: (id: string, label: string) => void;
  /** Localized ✕ label, per tab ("Close {name}" / "{name} 닫기"). */
  closeLabel?: (label: string) => string;
  /** Localized + label. */
  addLabel?: string;
  /**
   * Hint shown when the + disables at 7 — the spec wants a Tooltip ("Close a tab to open
   * another" / "탭을 닫고 새로 여세요"); Tooltip is not in the library yet (FLAGGED), so
   * this renders as the button's `title`.
   */
  addDisabledHint?: string;
}

/** Spec cap — 8 tabs means restructure; `editable` disables the + at 7. Beyond 7 open items is a Sidebar list or Tree. */
export const MAX_TABS = 7;

/** Registry `x` glyph (icons.md: "close"), 12px. */
const XGlyph = () => (
  <svg className="sy-tabs__x" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 6 6 18" /> <path d="m6 6 12 12" />
  </svg>
);
/** Registry `plus` glyph (icons.md: "create / add"), 16px. */
const PlusGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" /> <path d="M12 5v14" />
  </svg>
);

let warnedCap = false;

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    activeId,
    onChange,
    editable = false,
    onClose,
    onAdd,
    onRename,
    closeLabel = (label) => `Close ${label}`,
    addLabel = "New tab",
    addDisabledHint = "Close a tab to open another",
    className,
    ...rest
  },
  ref
) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [fades, setFades] = useState({ left: false, right: false });
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);
  const refocusId = useRef<string | null>(null);

  if (items.length > MAX_TABS && !warnedCap) {
    warnedCap = true;
    // eslint-disable-next-line no-console
    console.warn(
      `[synapse] Tabs holds 2–${MAX_TABS} tabs (components.md · Tabs). Author-defined sets: restructure ` +
        "the page; editable sets: the + disables at 7. Beyond 7 open items is a Sidebar list or Tree."
    );
  }

  /* Overflow scrolls with fade edges, never wraps (spec). The fades track scrollability. */
  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setFades((f) => (f.left === left && f.right === right ? f : { left, right }));
  };
  useEffect(() => {
    updateFades();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  /* Focus returns to the tab after a rename commits (spec A11y). */
  useEffect(() => {
    if (editing === null && refocusId.current !== null) {
      const el = scrollRef.current?.querySelector<HTMLButtonElement>(
        `[data-tabid="${CSS.escape(refocusId.current)}"]`
      );
      el?.focus();
      refocusId.current = null;
    }
  }, [editing]);

  /* Closing: `fast` width collapse (spec States), then the parent removes the item.
     Closing the ACTIVE tab activates its right neighbour, or its left if it was last. */
  const finishClose = (id: string) => {
    if (id === activeId) {
      const idx = items.findIndex((t) => t.id === id);
      const next = items[idx + 1] ?? items[idx - 1];
      if (next) onChange(next.id);
    }
    onClose?.(id);
  };
  const requestClose = (id: string) => {
    if (items.length <= 1) return; // never close the last remaining tab (spec Forbidden)
    const el = itemRefs.current[id];
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduced) {
      finishClose(id);
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      finishClose(id);
    };
    el.style.width = `${el.offsetWidth}px`;
    el.classList.add("sy-tabs__item--closing");
    requestAnimationFrame(() => {
      el.style.width = "0px";
    });
    el.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, 250); // fallback — the parent must always get onClose
  };

  /* Arrow keys move focus BETWEEN tabs; activation stays on Enter/Space (manual model —
     FLAGGED provisional reading of "arrow keys move between tabs"; contrast
     SegmentedControl, whose spec says arrows move SELECTION). Delete/Backspace on a
     focused tab closes it (`editable`). */
  const onStripKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const tabId = target.getAttribute("data-tabid");
    if (tabId === null) return;
    if (editable && (e.key === "Delete" || e.key === "Backspace")) {
      e.preventDefault();
      requestClose(tabId);
      return;
    }
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) return;
    e.preventDefault();
    const idx = items.findIndex((t) => t.id === tabId);
    const next = items[(idx + delta + items.length) % items.length];
    scrollRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tabid="${CSS.escape(next.id)}"]`)
      ?.focus();
  };

  const commitRename = () => {
    if (!editing) return;
    const trimmed = editing.value.trim();
    const item = items.find((t) => t.id === editing.id);
    if (trimmed && item && trimmed !== item.label) onRename?.(editing.id, trimmed);
    refocusId.current = editing.id;
    setEditing(null);
  };
  const revertRename = () => {
    if (!editing) return;
    refocusId.current = editing.id;
    setEditing(null);
  };

  const scrollCls = [
    "sy-tabs__scroll",
    fades.left && "sy-tabs__scroll--fade-l",
    fades.right && "sy-tabs__scroll--fade-r",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={["sy-tabs", className].filter(Boolean).join(" ")} {...rest}>
      <div
        ref={scrollRef}
        role="tablist"
        className={scrollCls}
        onScroll={updateFades}
        onKeyDown={onStripKeyDown}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          const isEditing = editing?.id === item.id;
          return (
            <span
              key={item.id}
              ref={(el) => { itemRefs.current[item.id] = el; }}
              role="presentation"
              className={[
                "sy-tabs__item",
                active && "sy-tabs__item--active",
                editable && "sy-tabs__item--editable",
                item.dirty && "sy-tabs__item--dirty",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {isEditing ? (
                <input
                  className="sy-tabs__rename"
                  defaultValue={item.label}
                  size={Math.max(item.label.length, 4)}
                  autoFocus
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => setEditing({ id: item.id, value: e.currentTarget.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(); // Enter commits (spec)
                    if (e.key === "Escape") revertRename(); // Esc reverts (spec)
                  }}
                  onBlur={commitRename}
                />
              ) : (
                <button
                  type="button"
                  role="tab"
                  id={`sy-tab-${item.id}`}
                  data-tabid={item.id}
                  aria-selected={active}
                  aria-controls={item.panelId}
                  tabIndex={active ? 0 : -1}
                  className="sy-tabs__tab"
                  onClick={() => onChange(item.id)}
                  onDoubleClick={
                    editable && onRename
                      ? () => setEditing({ id: item.id, value: item.label })
                      : undefined
                  }
                >
                  {item.label}
                  {item.badge != null && <span className="sy-tabs__badge">{item.badge}</span>}
                </button>
              )}
              {/* The ✕ is a SEPARATE button inside the tab shape, never part of the
                  activation target, and stays Tab-reachable within the strip (spec A11y).
                  Hidden when only one tab remains — never close the last one. */}
              {editable && !isEditing && items.length > 1 && (
                <button
                  type="button"
                  className="sy-tabs__close"
                  aria-label={closeLabel(item.label)}
                  onClick={() => requestClose(item.id)}
                >
                  <span className="sy-tabs__dot" />
                  <XGlyph />
                </button>
              )}
            </span>
          );
        })}
      </div>
      {/* The + sits OUTSIDE the scroll region so it never scrolls away; it DISABLES at 7
          (an unbounded strip is a Sidebar list or Tree, not tabs). */}
      {editable && (
        <button
          type="button"
          className="sy-tabs__add"
          aria-label={addLabel}
          disabled={items.length >= MAX_TABS}
          title={items.length >= MAX_TABS ? addDisabledHint : undefined}
          onClick={onAdd}
        >
          <PlusGlyph />
        </button>
      )}
    </div>
  );
});
