# Development Rules - TAU Engineering Principles

## Purpose
Guidelines for building AI agents, internal tools, and client systems. Follow these principles to maintain clean, testable, debuggable codebases.

---

## Core Architecture Rules

### 1. Config Files Per Agent/System
- Every agent or system gets its own configuration file
- Config files should include: job purpose, instructions, parameters, dependencies
- Never hardcode agent behaviour - externalise to config
- Makes systems auditable and swappable without code changes

### 2. Split Frontend and Backend
- Strict separation between UI layer and business logic
- Backend should be fully functional via API/CLI before any frontend exists
- Frontend is a "skin" - the system must work without it
- Enables headless testing and multiple interface options

### 3. Isolate Complex Frontend Tech
- JavaScript frameworks, animations, complex UX - build last, isolate completely
- Only invest in "funky" frontend when UX is the core value proposition
- Prototype throwaway UX early if validating user assumptions
- Keep experimental UI in separate modules that can be replaced without touching core logic

### 4. Modularise for Testability
- Every module should be independently testable
- When something breaks, you should be able to isolate it to one module
- Clear inputs, clear outputs, minimal side effects
- Avoid premature abstraction - modularise once you understand the problem, not before

---

## Development Process Rules

### 5. Version Control Prompts Like Code
- Prompt changes get commits with rationale
- Track what changed and why - prompt debugging is harder than code debugging
- Config files help here - prompts live in version-controlled files, not inline strings

### 6. Build Observability Early
- Log what agents do, not just outcomes
- Decision chains should be reconstructable after the fact
- When it breaks at 2am, you need to see why it made that choice
- Structured logging from day one - don't retrofit

### 7. Define Interfaces Before Implementations
- Agree what modules pass to each other before building internals
- Prevents "oh shit, I need this field too" refactors
- Contract-first development - the shape of data matters more than the code processing it

### 8. Keep Humans in Loops Longer Than Comfortable
- Automation that works 95% of the time will bite hard on the 5%
- Earn trust before removing guardrails
- Build approval steps you can remove later, not add later
- Default to "human confirms" until proven safe

---

## Anti-Patterns to Avoid

- **Inline configuration**: Behaviour buried in code instead of config files
- **Monolithic agents**: Single agents doing too many jobs
- **Frontend-first development**: Building UI before the system works headlessly
- **Premature optimisation**: Abstracting before understanding the actual problem
- **Silent failures**: Systems that fail without clear logging
- **Implicit interfaces**: Modules that assume data shapes without explicit contracts

---

## When to Break These Rules

- **Throwaway prototypes**: Quick validation doesn't need full discipline
- **UX-first experiments**: When testing whether an interaction works, build the interaction first
- **Emergency fixes**: Ship the fix, then refactor properly
- **Learning exercises**: Sometimes you need to see why the rule exists

Always note when you're breaking a rule and why. Technical debt is fine if it's conscious debt.

