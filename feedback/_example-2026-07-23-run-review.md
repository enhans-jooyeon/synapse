<!-- Illustrative fixture, not real data. Shows the ledger format + how a digest reads across screens. Delete once real entries accumulate. -->

# Example ledger entries (fixtures)

Three reviewed screens. Note the recurring `state-coverage` and `character-drift` signal — the kind of pattern the digest is built to surface.

```synapse-corrections
screen: run-review-inspector
archetype: workbench
harness_version: 1.0.1
- state-coverage | llm-generation | major | auto | no empty state for the run list
- character-drift | llm-generation | major | manual | drop-shadow + rounded-2xl cards → border-only
- token | gate-gap | minor | auto | raw #6b7280 in a status label slipped past the gate
- hierarchy | reviewer-preference | minor | manual | reordered header actions to taste
```

```synapse-corrections
screen: pipeline-run-history
archetype: console
harness_version: 1.0.1
- state-coverage | llm-generation | major | auto | missing loading + error states on the table
- character-drift | llm-generation | major | manual | gradient header banner, removed
- component-provenance | llm-generation | major | auto | hand-rolled table instead of PivotTable
```

```synapse-corrections
screen: ontology-object-detail
archetype: object
harness_version: 1.0.1
- character-drift | llm-generation | minor | manual | soft shadow on side panel, stripped
- component-provenance | contract-gap | major | auto | re-implemented AssistantPanel; contract was thin on docked variant
- other | requirement-change | minor | manual | PM added a field mid-review
```
