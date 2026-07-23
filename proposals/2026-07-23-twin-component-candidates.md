# Component candidates from the AOS digital twin

**Date:** 2026-07-23 · **Status:** proposal for maintainer decision (no components added) · **Source:** `enhans-jooyeon/AOS` `src/components/**`, triaged against `synapse.manifest.json` (52 components).

## Method & caveat

The twin uses the **old** design system with **no harness rules**, so its styling is *not* authoritative — we extract the component **type** (what UI primitive/pattern exists), never the look. Each type is triaged into: **NEW** (a real design-system gap the product uses), **RECIPE** (a composition of existing Synapse components — belongs in `recipes.md`, not a new component), or **OUT** (app/domain-specific or unused — belongs in product code, not the system).

Most of the twin's local files are domain compositions (deal cards, replay shells, price-tracker widgets) that ride on imported primitives — those are OUT by definition. The signal is in the few reusable *types* Synapse's 52 don't cover.

## Strong recommendations (NEW — product uses them, no coverage today)

### 1. Node-graph canvas family — the standout gap
The twin's `lineage/canvas.tsx` is a ReactFlow graph editor (nodes, edges, connection handles, dotted background, zoom/pan, minimap, node cards with status pills). **This is the biggest hole in the harness:** three core product surfaces — **Workflow Builder, Pipeline Builder, and the Ontology Link/Lineage graph** — are all node-graph editors, and Synapse's 52 components cover *none* of it. Any LLM asked to generate a builder screen today hits an RC6 coverage gap (nothing to compose from), which is likely a real cause of poor `workbench`-archetype output.

Proposed as a small family (spec first; character redesigned to Synapse's austere, borders-first language — not the twin's look):
- **GraphCanvas** — the pannable/zoomable surface (dotted/`bg.sunken` grid, fit-view).
- **FlowNode** — a node card on the canvas: header (icon + type + status), body, input/output **Ports**.
- **Edge / Connector** — typed connection line (+ labeled/branching variants for Condition nodes).
- **NodePalette** — the add-node source list (grouped, matches the Pipeline Extract/Transform/Load grouping).
- **CanvasControls** — zoom in/out, fit-view, minimap.

### 2. RunLog / execution viewer
The twin's run-review/run-log surfaces (Workflow **Run mode**, Pipeline run log `executions → nodes → logs`, the CUA run review) need a **hierarchical/streaming log panel** — expandable run → step → line, with per-step status and live-append. Synapse has `AgentStep`, `Timeline`, and `CodeBlock`, but no dedicated run/execution log component. Recurs across Agentic Work, Pipeline, and CUA → NEW.

## Borderline (maintainer's call)

- **PivotTable** — *not* in the twin's local components, but the product docs list a pivot table under the Application/dashboard surface. Synapse has `Table`, not a pivot. Flagging as a likely product need to confirm; if real, it's NEW (a distinct type, not a Table variant).
- **Global assistant panel** (`agent/global-agent.tsx`) — a docked/floating mini-agent that maximizes into the full chat. Likely a **RECIPE** (`Composer` + `Drawer`/floating shell) rather than a new component — decide whether the floating-assistant shell is worth standardizing.
- **App launcher overlay** (`apps/apps-launcher-overlay.tsx`) — grid launcher of apps/system-apps. Likely a **RECIPE** (a `CommandPalette`/`Modal` variant), not a new primitive.

## Not recommended (with reasons)

- **Kanban board / column / DealCard** (`pipeline/Kanban*`) — the product has **no confirmed kanban surface** (the CRM Kanban was twin-demo-only, per the live-product check). Don't add a component the product doesn't use.
- **Replay shells** (`ReplayBuilderShell`, `BrowserReplayWorkspace`, `MockBrowserScreenshot`, `ErrorRecoveryView`, …) — CUA app-screen compositions. The reusable bits are already captured above (GraphCanvas + RunLog); the rest are pages/recipes, not DS components. (CUA is dev-only anyway.)
- **Domain widgets** (`price-tracker`, `DealDetailPanel`, `PipelineHeader/List`, quick-create/confirm/add-stage modals) — product code or plain `Modal`/`Popover` usages; not design-system types.
- **`ui/` primitives** (accordion, badge, breadcrumb, button, card, chart) — already in the 52.

## Recommended next step

Promote **#1 (node-graph family)** and **#2 (RunLog)** to `components.md`, spec-only, with the character redesigned to the Synapse contract (they'd be spec entries like the other 48 unbuilt components). Confirm **PivotTable** as a product need. Each promotion is a governance change: add the `components.md` entry, rebuild the manifest, keep the gate green — done only on June's approval, one at a time.
