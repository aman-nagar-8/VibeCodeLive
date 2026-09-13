# Project Rules

## Critical Safety Rules

- Do NOT delete files unless explicitly requested.
- Do NOT modify files outside this project.
- Do NOT modify .env, .env.local, credentials, private keys, or secret files.
- Do NOT expose, print, log, or commit secrets.
- Do NOT change package versions unless explicitly requested.
- Do NOT introduce new dependencies unless necessary and explicitly explained.
- Do NOT rewrite working code unnecessarily.
- Preserve the existing architecture unless there is a strong reason to change it.
- Before making large architectural changes, explain the proposed changes first.
- Never run destructive commands such as:
  - rm -rf
  - git reset --hard
  - git clean -fd
  - DROP DATABASE
  - deleting production resources
- Never push to GitHub automatically.
- Never create commits unless explicitly requested.

## Development Workflow

Before modifying code:

1. Understand the existing architecture.
2. Identify relevant files.
3. Explain the intended change.
4. Make the smallest reasonable change.
5. Run relevant tests.
6. Run lint/type checks if available.
7. Show me what changed.

## Code Quality

- Follow the existing coding style.
- Reuse existing utilities and abstractions.
- Avoid unnecessary refactoring.
- Prefer small, focused changes.
- Don't duplicate existing functionality.
- Keep backward compatibility unless explicitly told otherwise.

## Testing

After making changes:

- Run relevant unit tests.
- Run integration tests when appropriate.
- Run linting.
- Run TypeScript type checking if applicable.
- Do not modify tests merely to make failing tests pass.
- If a test fails, explain the root cause.

## Before Large Changes

If a change affects multiple modules, database schemas,
authentication, API contracts, or deployment:

STOP and explain the plan before implementing it.

## Agent Philosophy

You are working on an existing production-quality codebase.

Do not assume that existing code is wrong simply because
you would implement it differently.

Prefer:
- minimal changes
- existing abstractions
- existing dependencies
- existing architecture
- backward compatibility

Avoid:
- unnecessary refactoring
- rewriting working code
- introducing new libraries
- changing unrelated files
- speculative improvements

If you discover an unrelated problem:
DO NOT fix it automatically.
Report it separately.

If requirements are ambiguous:
ASK before implementing.

If a change could have destructive consequences:
STOP and ask for confirmation.

Correctness is more important than speed.