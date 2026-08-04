# Architecture

This document explains the reasoning behind ReviewPilot's key design decisions, not just what was built, but why, and what the tradeoffs were.

## Deterministic tool calling, not agentic (yet!)

ReviewPilot's PR review pipeline (fetch metadata → files → CI checks → diff → optionally dependency alerts → synthesize) is a fixed sequence executed by application code, not something Claude decides at runtime. No `tool_choice: auto`, no tools attached to the synthesis call at all.

This was a deliberate choice, not a limitation of the tools available:

- **CI status has to be surfaced before code quality**, every time, without exception. A red build blocks merge regardless of how clean the code looks. Letting a model decide the order of investigation risks it occasionally prioritizing a code-quality narrative over a failing check. A fixed sequence guarantees the priority every single run.
- **Determinism means reproducibility.** The same PR produces the same tool-call sequence every time, which matters for debugging.
- **Cost and latency.** One assembled context plus one synthesis call is cheaper and faster than a multi-turn agentic loop where the model calls a tool, waits, decides the next call, and repeats.

The one deliberately agentic decision point that remains: whether to fetch Dependabot alerts is conditional on whether the changed files touch a dependency manifest. This is a genuine branch, not a fixed step, but it's still simple enough to be a rule rather than something that needed model judgment.

**What this means honestly**: ReviewPilot demonstrates MCP client integration (authentication, tool invocation, handling real API responses) more than it demonstrates agentic AI. Those are different skills. The roadmap item for natural-language repo Q&A (see README) is where a genuine `tool_choice: auto` loop would be introduced, that's intentionally scoped as a separate, later addition rather than retrofitted into the review pipeline, where determinism is a feature.

## Why no agent framework (LangChain, OpenAI Agents SDK, etc.)

The Vercel AI SDK, already in use for the MCP client, provides everything this project needs: `generateObject`/`streamObject` with a Zod schema for structured synthesis, and (for the future agentic roadmap item) `ToolLoopAgent` for a multi-step tool-calling loop. Adding a separate agent framework would mean learning a new set of abstractions on top of an already-new stack (MCP, Next.js App Router), for a single-agent, single-MCP-server use case that doesn't need multi-agent orchestration, handoffs, or durable cross-session state, the actual problems those frameworks solve.

## Known upstream issues worked around

- `pull_request_read`**'s** `get_diff`**,** `get`**, and** `get_reviews` **methods don't support pagination**, and `get_diff` can exceed response size limits on large PRs. ReviewPilot catches this and falls back to a file-list-only summary rather than failing the review outright.

## Backend: Next.js API routes, not a separate service

Next.js API routes handle both the MCP tool sequence and the LLM synthesis call, keeping the GitHub PAT and Anthropic API key server-side without the overhead of running and coordinating two servers.
