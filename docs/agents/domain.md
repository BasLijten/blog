# Domain Docs

The engineering skills should consume this repository's domain documentation as follows.

## Before exploring

- Read `CONTEXT.md` at the repo root when it exists.
- Read ADRs in `docs/adr/` that touch the area being changed.
- If these files do not exist, proceed silently. Create them lazily when terms or decisions actually need to be recorded.

## File structure

This is a single-context repository:

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use the glossary vocabulary

When output names a domain concept, use the term as defined in `CONTEXT.md`. If the required concept is not documented there, treat that as a signal to clarify or record the missing domain language.

## Flag ADR conflicts

If a proposed change contradicts an existing ADR, surface the conflict explicitly instead of silently overriding it.
