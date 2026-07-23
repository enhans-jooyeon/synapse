<!-- Reference layer, EN-only, ungated. The AgentOS product model the Frame + Intake phases ground on (see docs/process/screen-intake-skill.md, design-cycle.md). NOT part of design.md's closed sets — an input to generation, not a contract rule. v1 (2026-07-23). Sources, by authority: (1) docs.commerceos.ai — the authoritative, current product docs (updated May–June 2026); (2) the enhans-jooyeon/AOS digital twin — an exploratory React build, source of the screen inventory + role model (June confirms the role model is authoritative; other twin-only surfaces are marked ⚑ CONFIRM); (3) the older app-generation/ COS specs (superseded framing). The IA section was verified read-only against the live product (app.commerceos.ai) on 2026-07-23. Safe to edit freely. -->

# AgentOS (AOS) — product context

The product Synapse generates UI for. It answers, for the generator: *what is this product, who uses it, what are they doing, where does a screen sit, and who's looking at it?* Intake and Frame **ground the user's prompt against this file** — a screen that can't be placed here isn't ready to generate.

**Authority key:** plain text = confirmed by the product docs (`docs.commerceos.ai`, authoritative). **⚑ CONFIRM** = observed only in the exploratory digital twin (`enhans-jooyeon/AOS`); real intent likely, but verify it's current/in-scope before treating as fixed.

## What AgentOS is

**AOS = "Agent Operating System"** by Enhans — a platform that structures a customer's data into **domain knowledge (an ontology)** and uses it to build **domain-specialized AI agents** that solve real business problems. It connects **data → knowledge → execution → action** in one flow. Commerce-focused. Character matches Synapse itself: an operational **precision instrument**, data-dense, not a consumer app.

- **Organizations:** e-commerce companies, brands, distributors/retailers, marketplace operators.
- **Personas:** data engineers, data analysts, MDs (merchandisers), marketers, operations staff.

## The four core modules (authoritative framing)

The current docs frame AOS as four modules — use this as the product spine (it supersedes the old six-module COS split):

1. **Data Flow** — connect DBs / APIs / files, preprocess & normalize, load into the ontology. *(The Pipeline / ETL surface.)*
2. **Ontology** — give data meaning and relationships; the agent's domain knowledge + memory.
3. **Agent Builder** — compose and run domain-knowledge-based multi-agent workflows. *(The Agentic Work surface.)*
4. **View Generator** — auto-generate ontology-based dashboards.

Cross-cutting surfaces that sit alongside the four: **Agentic AI chat** (conversational/exploratory, complementary to structured Agentic Work), **Admin & Settings** (permissions, credits), and the integration surfaces (**MCP**, **Open API**).

## Ontology model (the heart of the product)

AOS keeps a **semantic/ontology layer separate from the raw DB** (data stays in place, Medallion-style) — roots in Data Warehousing, Ontology, and Domain-Driven Design. The mental model the docs use: **Objects = buildings, Links = roads, Knowledge = traffic rules**; the agent navigates these to answer.

- **Object** (concept/class) — a business entity (Product, Order, Customer). Holds Properties + Sources. The basic unit; foundation for chat and view generation.
- **Object Property** (attribute) — a field (price, quantity, date).
- **Object Source** (instance) — the actual structured rows behind an Object.
- **Link** (relation) — a pre-defined relationship enabling join-free traversal; has a **Type** (sameAs, relatedTo…) and **Cardinality** (1:1, 1:many). Connects Object↔Object, Property↔Object/Knowledge, Knowledge↔Knowledge.
- **Knowledge** (axiom) — business rules/constraints/synonyms ("Revenue = Sales"; "black-seller = monthly revenue ≥ 100M KRW"). The most critical element of agent memory.
- **Annotation / Comment** — free-text context on an Object or Property; the primary lever to improve answer quality.
- **Catalog (Preview)** — manages Objects in **Collections**; query editor (SQL, Cypher+graph, natural-language→SQL with reasoning trace); an **Action system** (CREATE/UPDATE/DELETE/CUSTOM; steps: HTTP call, ontology CRUD, run Workflow, trigger Work; Execute or Dry-run).
- **Knowledge Dictionary** — registers knowledge from Text / File / Web URL / Image / **Verified SQL**; metadata (Name, Category, Tags, Path); scope Only Me / Entire Group; **Base Knowledge = always referenced first**; Verified SQL registers a validated query as a named **OntologyFunction** the chat can call.

## Agentic Work (Agent Builder)

The execution engine. **Workflows** define *what*; **Automations** define *when*. Agents read/write the ontology; outputs flow to dashboards or pipelines; deployed workflows are callable from the AI chat.

- **Workflow** — a visual `Start → nodes → End` directed graph (sequential/parallel/branching). **Build mode** (design, edit-gated) vs **Run mode** (read-only + Run Log + Test Run). Draft-and-deploy, versioned.
- **Node types (8):** **Agent** (LLM on a system prompt; toggles for Ontology context, Knowledge, Tools, files; model select; output Text or Structured JSON; `{{variable}}` refs), **Code** (Python), **Condition** (if/elseif/else), **Wait** (duration), **Email** (SMTP), **HITL** (human approval gate + notification, optional timeout→auto-reject), **Create Ontology** (write upstream data as new records), **Ontology Query** (SQL-style read → array).
- **Automation** — `If (trigger) → Then (action)`. Triggers: **Event** (currently "new row created" on an Object) or **Schedule** (hourly/daily/weekly, timezone, weekdays). Action: run a deployed Workflow (+ optional extra input, + optional email of results). Scope Only Me / Entire Group.

## Data Flow (Pipeline Builder)

ETL: **Extract → Transform → Load** into the ontology. Needs a configured external connection; exactly one Start + one End; most nodes support Data Preview (≤100 rows).

- **Flow:** Start, End, Backfill (iterative sync), Note.
- **Extract:** Data Retrieval (DB / HTTP-OAuth2), Generate Data (synthetic), Read Ontology Object.
- **Transform:** column ops, Cast, Parse JSON, **Parse Document** (LLM/OCR → markdown, async), **LLM Operator** (prompt → structured JSON), **Notebook Transform** (Jupyter Python).
- **Load:** Lake Ontology Create (bulk upsert), Upsert Knowledge, Ontology Link Create, Object Creation.
- **ETC:** Custom Node (Python). **Parse Outputs** viewer; **Data Preview**.

## Integration surfaces

- **MCP server** — expose selected Ontology **Objects / Dictionary** items as callable tools to MCP clients (Claude Desktop, Cursor); auto-includes connecting Links; endpoint `agent-api.commerceos.ai/mcp/{id}`, Bearer token shown once.
- **Open API** (`/open/v1/**`) — API-key (Bearer) access: Translate-SQL, run SQL, **Run Work** (execute a workflow), **Run Pipeline with File**. Standard `ResponseBody` wrapper; OpenAPI/Swagger published.

## Roles & permissions (authoritative — grounds `viewer_role` / SY109)

June confirmed the digital twin's model is authoritative. This is the vocabulary Intake uses for permission variants:

- **Role tiers (clearance order):** `Guest < Member < Manager < Owner < Admin`. Admin = Enhans cross-tenant staff; Owner = tenant admin; Manager = team lead; Member = standard; Guest = read-only external.
- **Resource ownership:** **My / Team / AOS (built-in)** — built-in and Team-owned items are run/clone-only, not editable by others.
- **Sharing scope:** **Only Me / Entire Group** (Group Owners get full access).
- **ABAC attributes:** clearance, employmentType, region, department, division, costCenter, title (operators: is / is not / is any of / is at least; effect Allow/Deny).
- **Grant resolution:** default → role → group → user, at domain and per-item level. Governance surfaces: Access Requests, Access Reviews, Impersonation/View-as (audited), append-only audit logs.

## Information architecture (verified against the live product, 2026-07-23)

Confirmed by a read-only walk of the live tenant app (`app.commerceos.ai`). The left rail has **seven top-level surfaces**:

- **Agentic AI** (`/ai`) — the conversational agent / chat surface.
- **Application** (`/dashboard`) — dashboards / generated applications (the View Generator output surface; this is the "app builder" surface, named **Application**).
- **Agentic Work** (`/work`) — two tabs only: **Workflows** (워크플로우) + **Automations** (자동화).
- **Ontology** (`/ontology/*`) — sub-nav: **Object list** (`/object`) · **Catalog (Preview)** (`/catalog`) · **Link list** (`/link`) · **Knowledge Dictionary** (`/dictionary`) · **Test Case** (`/test-case`); plus data upload.
- **Pipeline builder** (`/pipeline`) — the ETL DAG builder.
- **Governance** (`/governance/*`) — includes **Lineage** (`/lineage`, a graph canvas) and access/audit governance.
- **Q&A** (`/inquiries`) — support / inquiries.

**Resolved (all real, was ⚑):** the App Builder is the **Application** surface; **Catalog** lives under Ontology; **Lineage** lives under **Governance**; **Q&A** is a real top-level surface.

**Dev-only (real, not yet in the live tenant nav):** the **CUA / browser-automation agent** ("Replays" in the twin) — in active development on the dev server, not yet shipped to the live product. It's a real surface; mark screens for it as **dev-stage**.

**Admin console (real, separate):** exists as its own console with a separate role/login. The **live** admin console is very outdated and does **not** resemble the twin's `/platform` prototype — treat the twin's admin screens as *intended/future* direction, not the current live state.

**Excluded (twin demo only):** the CRM-style deal Kanban is not part of the product.

## Core entities (nouns a screen displays/acts on)

Ontology Object · Property · Source · Link · Knowledge · Catalog Collection · Test Case · Workflow · Node · Automation · Pipeline · Connection · Application/Dashboard/View · **Tenant** (plan, seats, sub-tenants) · **TenantUser** (role + ABAC attributes) · **Model** (LLM: anthropic/aws/google/openai/enhans) · **Tool** (MCP/Internal) · **Gold** (credit/token currency) · **Inquiry** (Q&A) · CatalogItem/Lineage (Governance: type, sensitivity, grants, lineage). **CUA / browser-automation run** (real, dev-only). *Excluded (twin demo only): CRM deal/Kanban.*

## Mapping to Synapse archetypes (Intake → composition hint)

- Builders (Workflow, Pipeline, App Builder), Ontology ERD → `workbench` (canvas + inspector; Build/Run modes).
- AI chat, ontology chat → `console`.
- An Object / dashboard / workflow / agent detail → `object`.
- Settings, permissions, admin → `settings`.
- First-run / onboarding → `guided`. Landing → `home`.

## Jobs-to-be-done

Build/deploy a repeatable multi-agent workflow · automate a recurring op on a trigger/schedule · ask an ontology-grounded (low-hallucination) question · auto-generate a dashboard/report · build & annotate the ontology, register knowledge, test comprehension · connect a source and shape raw data into the ontology · monitor prices / detect bad sellers / analyze reviews · administer roles, credits, and access.

## Use cases (commerce)

Competitor price monitoring (multi-marketplace) · review-analysis automation · promotion optimization (ROI) · inventory management (demand forecast). Built-in example workflows: YouTube keyword collection, Naver Shopping price scraping.

## Open threads / needs input from June

1. **Twin surfaces — resolved (live walk 2026-07-23 + June's clarifications):** App Builder = the **Application** surface; **Catalog** (under Ontology), **Lineage** (under Governance), and **Q&A** are all real. **CUA / browser-automation** is real but **dev-server-only** (not yet in the live nav) — include as dev-stage. The **admin console** is real but a **separate console**, and its live version is outdated vs the twin prototype (twin = intended direction). Only the **CRM Kanban** is excluded (twin demo). *If you want the CUA and admin surfaces verified visually, share the dev-server URL.*
2. **Per-module nav/IA detail** — the within-module navigation and screen hierarchy (docs give modules; twin gives routes; a definitive nav map would sharpen archetype placement).
3. **Tone/voice** — a product voice reference beyond `content.md`'s glossary.
4. **Naming reconciliation (optional)** — the `app-generation/` specs still say "COS/Enhance"; product name is AgentOS.
