<!-- Ungated, outside validate.py scope. The collection point for correction-ledger entries harvested from reviewed screens. Read by `synapse digest`. Schema: docs/process/correction-ledger.md. -->

# feedback/ — correction-ledger inbox

The collection point for the harness's **memory** element. Each file here holds one or more
`synapse-corrections` blocks captured during PR review (schema:
[`docs/process/correction-ledger.md`](../docs/process/correction-ledger.md)).

**How entries arrive**

- **Interim (any workflow):** paste a reviewed PR's `synapse-corrections` block into a `.md` file here, named `YYYY-MM-DD-<screen>.md`.
- **Automated (once the GitHub connector is authorized):** merged-PR blocks are harvested here directly, no manual step.

**Reading the evidence**

```bash
python3 tools/synapse.py digest            # rolls up everything in feedback/
python3 tools/synapse.py digest <folder>   # or point at another folder
```

The digest separates the **harness-actionable signal** (`llm-generation` / `contract-gap` / `gate-gap`) from taste and product-requirement churn, then flags **recurring** categories as candidate design-system changes to take to `harness-refinement-register.md`.

`_example-*.md` files are illustrative fixtures — delete them once real entries accumulate.
