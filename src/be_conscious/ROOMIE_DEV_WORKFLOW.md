# ROOMie Development Workflow (MANDATORY)

> This workflow is **non‑negotiable** for all AI agents and human contributors touching the ROOMie codebase.
> No code or schema change may be made without following these steps.

---

## 0. Scope & Hard Rules

- Applies to **all changes** that affect runtime behavior:
  - React/TypeScript frontend
  - Supabase schema, RLS, Edge Functions
  - Pricing/commission logic, booking flows, visibility rules
- Pure documentation tasks may stop after Step 4 but must still:
  - Load the shared brain (Step 1)
  - Do basic archaeology (Step 3)
- **Forbidden shortcuts**:
  - No “quick fix” PRs without archaeology & research
  - No DB migrations without following the DATABASE MIGRATION PROTOCOL
  - No runtime AI text generation in the app (copy must be deterministic)

---

## 1. Load the Shared Brain (be_conscious)

Before touching any feature:

1. Read the files in `src/be_conscious/`:
   - `PROPERTY_PIPELINE_CONTRACT.md`
   - `ROOMIE_DEV_WORKFLOW.md` (this file)
   - `project_state.md`
   - `code_standards.md`
   - `decision_log.md`
2. Summarize (in your own words) in the conversation:
   - The **business rule** relevant to your task
   - Any **existing decisions** for this area (IDs like `DEC-...`)

Treat this as your Product + Architecture brief.

---

## 2. Product Lead Restatement & Scoping

Act as the **Product Lead** and restate the task:

- Problem (one paragraph)
- Goal / Definition of Done (bullet points)
- Non‑goals (what we explicitly will NOT change)
- Risks / unknowns that might block us

Write this in the conversation before any new code analysis.

---

## 3. Archaeology (Code + DB)

Act as **Staff Engineer / Tech Lead**. Your job here is to understand what already exists.

1. **Start from be_conscious**
   - Re‑read any relevant sections in `PROPERTY_PIPELINE_CONTRACT.md` and `code_standards.md`.

2. **Code archaeology (tools required):**
   - Use `codebase-retrieval` to locate:
     - The main functions/services for this feature
     - Their callers (hooks, components, edge functions)
   - Use `view` to open the specific files/sections returned.

3. **DB archaeology (if schema is involved):**
   - Follow the DATABASE MIGRATION PROTOCOL (never assume schema):
     - Design verification SQL
     - Wait for user to run and share actual output before proposing migrations

4. **Document findings** in the conversation:
   - Current behavior (Owner, Admin, Student flows)
   - Known inconsistencies or dead code

No implementation yet.

---

## 4. External Research (Web + Docs)

Act as **Research Engineer**.

- When behavior is non‑trivial (auth, payments, visibility, pricing, etc.):
  - Use `web-search` / `web-fetch` to check:
    - Latest framework/library best practices
    - Official docs for Supabase, React Query, Paystack, etc.
- Cross‑check:
  - Does the current ROOMie code follow these practices?
  - Are there security or correctness risks?

Summarize only what is relevant to the current task.

---

## 5. Design Options & Decision Log Entry

Now act as **Architect + UX Designer**.

1. Propose **at least 2–3 design options**:
   - For each: describe behavior, pros, cons, and impact on existing flows.
2. Choose one option explicitly.
3. Create or update a `DEC-...` entry in `decision_log.md` with:
   - Problem, options considered, chosen approach
   - Potential impacts, rollback plan, code references (planned)

Only after this step can you start coding.

---

## 6. Implementation (Minimal, Targeted)

Now act as **Senior Frontend/Backend Engineer**.

- Use the narrowest possible changes to implement the chosen design.
- Rules:
  - Prefer extending existing utilities/hooks/components over creating new ones.
  - Use `str-replace-editor` for edits; do **not** recreate whole files.
  - Respect existing patterns from `be_conscious` and `code_standards.md`.
  - Keep changes small and well‑scoped per PR/commit.

If new types, hooks, or components are needed:

- Add TypeScript interfaces/types.
- Add JSDoc for complex functions.
- Keep single‑responsibility components.

---

## 7. Verification, Tests & State Updates

Now act as **QA Engineer**.

1. **Automated checks** (via `launch-process`):
   - Run the smallest relevant test set (unit/integration).
   - Run linters/type‑checkers if impacted.
2. **Behavior verification**:
   - Describe which flows you manually validated (e.g., Owner create property → toast, Student search → card visibility).
3. **Update project state**:
   - In `project_state.md`:
     - Move issues from "Current" to "Fixed" when done.
   - In `decision_log.md`:
     - Mark the relevant decision as IMPLEMENTED; add code/test references.

Only after these steps is the task considered complete.

