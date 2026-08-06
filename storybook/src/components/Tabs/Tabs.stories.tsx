import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, MAX_TABS } from "./Tabs";
import type { TabItem } from "./Tabs";
import { Badge } from "../Badge/Badge";

/**
 * Spec: components.md · Tabs (editable variant 2026-07-30; last synced 2026-08-05).
 * SYNC partner of Tabs.tsx / Tabs.css — the stories exercise base tabs with the count
 * Badge, overflow with fade edges (scroll, never wrap), and the `editable` variant:
 * ✕ per tab (dirty dot until hover), the + disabling at 7, double-click rename,
 * and right-neighbour activation on closing the active tab.
 */
const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    items: [
      { id: "overview", label: "Overview" },
      { id: "runs", label: "Runs" },
      { id: "settings", label: "Settings" },
    ],
    activeId: "overview",
    onChange: () => {},
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Base: Story = {
  name: "Base (peer views + count Badge)",
  render: function Render() {
    const [active, setActive] = React.useState("overview");
    return (
      <div style={{ width: 420 }}>
        <Tabs
          items={[
            { id: "overview", label: "Overview", panelId: "panel-overview" },
            { id: "runs", label: "Runs", badge: <Badge>12</Badge>, panelId: "panel-runs" },
            { id: "issues", label: "Issues", badge: <Badge color="danger">3</Badge>, panelId: "panel-issues" },
            { id: "settings", label: "Settings", panelId: "panel-settings" },
          ]}
          activeId={active}
          onChange={setActive}
        />
        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`sy-tab-${active}`}
          style={{ padding: "var(--sy-space-4) 0", font: "var(--sy-weight-regular) var(--sy-body-size)/var(--sy-body-lh) var(--sy-font-sans)" }}
        >
          Peer view of the same object — the strip owns navigation, the page owns this panel.
        </div>
      </div>
    );
  },
};

export const OverflowScrolls: Story = {
  name: "Overflow (scrolls with fade edges, never wraps)",
  render: function Render() {
    const [active, setActive] = React.useState("t1");
    return (
      <div style={{ width: 360 }}>
        <Tabs
          items={[
            { id: "t1", label: "Quarterly revenue" },
            { id: "t2", label: "Pipeline coverage" },
            { id: "t3", label: "Churn analysis" },
            { id: "t4", label: "Forecast accuracy" },
            { id: "t5", label: "Renewal cohorts" },
          ]}
          activeId={active}
          onChange={setActive}
        />
      </div>
    );
  },
};

export const Editable: Story = {
  name: "Editable (user-created tabs)",
  render: function Render() {
    const [items, setItems] = React.useState<TabItem[]>([
      { id: "q1", label: "Revenue query", dirty: true },
      { id: "q2", label: "Churn draft" },
      { id: "q3", label: "Untitled 3" },
    ]);
    const [active, setActive] = React.useState("q1");
    const nextId = React.useRef(4);
    return (
      <div style={{ width: 520 }}>
        {/* Dirty tab: 6px dot replaces the ✕ until hover. Delete/Backspace closes the
            focused tab; double-click renames in place (Enter commits, Esc reverts);
            closing the active tab activates its right neighbour, or left if last. */}
        <Tabs
          editable
          items={items}
          activeId={active}
          onChange={setActive}
          onClose={(id) => setItems((ts) => ts.filter((t) => t.id !== id))}
          onRename={(id, label) => setItems((ts) => ts.map((t) => (t.id === id ? { ...t, label } : t)))}
          onAdd={() => {
            const id = `q${nextId.current}`;
            nextId.current += 1;
            setItems((ts) => [...ts, { id, label: `Untitled ${ts.length + 1}` }]);
            setActive(id);
          }}
        />
      </div>
    );
  },
};

export const EditableAtCap: Story = {
  name: "Editable at the 7-tab cap (+ disables)",
  render: function Render() {
    const [items, setItems] = React.useState<TabItem[]>(
      Array.from({ length: MAX_TABS }, (_, i) => ({ id: `t${i + 1}`, label: `Workspace ${i + 1}` }))
    );
    const [active, setActive] = React.useState("t1");
    return (
      <div style={{ width: 640 }} lang="ko">
        {/* The + disables at 7 with the hint ("탭을 닫고 새로 여세요") — rendered as `title`
            until Tooltip lands in the library (FLAGGED). Beyond 7 open items is a Sidebar
            list or a Tree, not a tab strip. */}
        <Tabs
          editable
          items={items}
          activeId={active}
          onChange={setActive}
          onClose={(id) => setItems((ts) => ts.filter((t) => t.id !== id))}
          onAdd={() => {}}
          closeLabel={(label) => `${label} 닫기`}
          addLabel="새 탭"
          addDisabledHint="탭을 닫고 새로 여세요"
        />
      </div>
    );
  },
};
