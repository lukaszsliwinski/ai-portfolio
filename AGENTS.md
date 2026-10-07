<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project documentation

The chatbot MVP scope and implementation details are documented in:

- `docs/portfolio-chatbot-mvp-plan.md`
- `docs/portfolio-chatbot-implementation-guide.md`

Use these documents as the source of truth for scope, architecture, and acceptance criteria.
Do not implement future-scope features unless explicitly requested.

## Current project structure

- `app/` contains pages, layout, and the chat HTTP endpoint in `app/api/chat/route.ts`.
- `components/chat/` contains the chat UI; `components/ui/` contains reusable UI components.
- `chat/` contains chatbot logic, configuration, logging, and shared chat types.
- `chat/model/` contains the Gemini integration and system prompt.
- `chat/security/` contains request validation and rate limiting.
- `chat/knowledge/` contains knowledge loading, formatting, and types.
- `chat/knowledge/data/` contains the chatbot's Markdown knowledge files and `meta.json`.
- `lib/` contains shared utilities and constants.

The documentation may still reference the previous `lib/ai/`, `lib/chat/`, `lib/security/`, `lib/knowledge/`, and root `content/` paths. Use the current paths above when locating or modifying files; the documented MVP scope and acceptance criteria still apply.

## Implementation guidelines

Before writing or modifying Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`.

Prefer small, reviewable changes.
Keep dependencies minimal.
Document important trade-offs when making implementation decisions.