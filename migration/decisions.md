# Open decisions & standing risks

Extracted from `visual-diff.html` so that file can stay visual. Full rationale for anything already decided is in `CHANGELOG.md` → Unreleased.

---

## Needs a decision

### 1. Is the category hash a contract?
`category-1…8` are **positional, not semantic** — `category-5` means "hash slot 5", which happens to be purple. Nothing in `foundations.md` or `components.md` states whether the label→slot mapping is a stable contract or an implementation detail.

Three ways it breaks:
- Change the hash function → every existing label recolours.
- Change the slot count (8→5, 8→10) → everything reshuffles.
- Rename a label → new hash, new colour, though users read it as the same tag.

Users build memory around these ("the purple one is Billing"), so a reshuffle is a real regression with no token value changed.

**To decide:** write the algorithm + slot count into the spec and declare changes to either breaking; or explicitly mark the mapping as unstable so nobody relies on it.

### 2. Should high-value taxonomies be pinned rather than hashed?
Hashing suits unbounded user-created labels. A closed set the org cares about ("Billing", "Infrastructure") is better served by an explicit override table. The spec currently says category colours are **"never hand-picked"**, which forecloses pinning by rule rather than by reasoning.

### 3. Rename `Chip` → `Tag`?
Polaris, Carbon and Atlassian all use "Tag" for this component; "Chip" is Material's term. If the team says "tag", the component should probably be `Tag`. Not applied — it has FE impact.

### 4. Categories: 8 or 5?
Dropping to 5 would make `purple`/`teal`/`magenta` genuinely dead and removable. But it recolours every existing label (see #1) and increases hash collisions. This is a migration, not a cleanup.

---

## Standing risks — decided, but need watching

### `brand` scarcity is no longer enforced structurally
`target="brand"` was capped at 1/screen by **absence** — only one variant could carry it. With four styles able to, the cap depends on review or lint. `foundations.md` §1 argues scarcity is load-bearing for the accent, so this is governance debt the two-axis change created.

### Two blues, no mechanical guard
azure = brand, indigo = link/focus/info. The never-mix rule is written as absolutely as prose allows, but nothing enforces it. A lint rule would.

### `secondary` and `ghost` are identical on `bg.sunken`
The tonal fill `#F4F4F6` *is* the sunken surface colour, so the fill vanishes. Predates the axis change but falsifies foundations' stated justification for the tonal/transparent split. Spec now requires `secondary` to open to `bg.page` there (the ProposalCard tray rule) — that fix is my inference from precedent, not a decision anyone made.

### Chart contrast is a registered deviation
viz is gated at **2.5:1**, not the 3:1 of WCAG 1.4.11 / Carbon / Cloudscape. Bounded to chart marks; labels or legends are required. A 3:1 version measuring min ΔE 31.4 is documented as the fallback. **Will surface in a formal WCAG/VPAT audit** — same category as the §9 solid-label deviation.

### SY017 has missed real drift three times
The manifest gate compares `synapse.manifest.json` against what `build_manifest.py` emits — both carry the same stale strings, so it verifies self-consistency rather than agreement with `components.md`. It missed the Button `accent` rename, the Button graphite→blue change, and the Badge `rounded` retirement. Same structural flaw as the token parity gap.

### `viz-1/2/3/4/8` still hold literals
`viz-5/6/7` were briefly backed by ramps, but that coupling was undone when viz became a separate chart palette. Backing ramps for all eight would close the remaining half of Defect 4 in `token-convention-audit.md`.

---

## Resolved, for reference

| Item | Outcome |
|---|---|
| Old brand colour | Azure `#0a84ff` in v0.13.6 — verified. The branding kit shows near-black because it is built on v0.9.3. |
| Button API | Two axes restored; `tertiary`→`secondary`, `secondary`→`outline` |
| `xs` 24px | Added, inline-only per the WCAG 2.5.8 Inline exception |
| Badge/Chip split | Fill, not shape; shape freed on Badge |
| Badge `purple`/`slate`/`outline`/`active` | Squashed — zero usage even in the library's own stories |
| viz muting | Reversed; viz is chart-only and per-mode |
| Category tints | New `category-*` family from UI ramps, all AA-gated |
| Unused colour scales | None. Primitives never ship, so trimming saves zero bytes. |
