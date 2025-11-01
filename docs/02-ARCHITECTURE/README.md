# 02-ARCHITECTURE

Purpose
- This folder contains system overviews, diagrams, and high‑level architectural decisions for ROOMie.
- It explains the “why” and “how” at a conceptual level for the whole platform.

Source of truth and cross‑references
- Do not duplicate content from src/BE CONSCIOUS/ — that directory is the authoritative Apple‑grade standards hub for architecture, business rules, and engineering protocols.
- When you need exact standards, policies, or canonical flows, consult src/BE CONSCIOUS/ first and link to it from here as needed.

Suggested contents
- System context diagrams, C4 views, and service boundaries
- High‑level data flows: booking, verification, payments, notifications
- Key architectural decisions (ADRs) and tradeoffs
- Integration maps for Supabase (DB/Auth/Storage/Edge Functions) and Paystack
- Performance, reliability, and security models at a high level

Conventions
- Keep this folder focused on overviews and decisions; implementation details belong in docs/04-DEVELOPMENT/ and the codebase.
- Prefer linking to canonical specs under src/BE CONSCIOUS/ rather than copying them.
- Use concise diagrams and keep them synchronized with real system behavior.

Related canonical docs
- Business logic: docs/03-BUSINESS-LOGIC/
- Development guides: docs/04-DEVELOPMENT/
- Historical materials: docs/07-LEGACY/

