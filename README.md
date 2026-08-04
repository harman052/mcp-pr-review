# ReviewPilot

An AI-powered PR review assistant built on GitHub's MCP server, using the Vercel AI SDK and Next.js.

ReviewPilot pulls a pull request's metadata, changed files, CI status, and diff via the [GitHub MCP server](https://github.com/github/github-mcp-server), assembles it into context, and asks LLM to produce a structured review summary: risk level, CI status, files that need a closer look, and open questions worth asking the author. It's a review aid, not a merge decision, it never tells you a PR is safe to merge.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the reasoning behind the key design decisions in this project.

## What it does

1. Enter a GitHub repo, see its open pull requests.
2. Select a PR, ReviewPilot fetches its metadata, changed files, CI check runs, and full diff.
3. LLM synthesizes that context into a structured review: overview, risk level, CI status, files needing attention, and open questions.

## Tech stack

- **Next.js** (App Router) for the frontend and API routes.
- **Vercel AI SDK** (`ai`, `@ai-sdk/mcp`, `@ai-sdk/anthropic`) for the MCP client and structured LLM output.
- **GitHub MCP server** (self-hosted, via Docker) as the data source.
- **Zod** for the structured output schema shared between the LLM call and the frontend types.

## Getting started

### Prerequisites

- Node.js 20+.
- A GitHub personal access token (PAT) with `repo` read scopes. Learn how to [create fine-grained personal access token.](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
- An [Anthropic API key](https://platform.claude.com/docs/en/get-api-key) or [Vercel AI Gateway API key.](https://vercel.com/docs/ai-gateway/getting-started/text#set-up-your-api-key)

### Setup

```bash
git clone https://github.com/<your-username>/mcp-pr-reviewer.git
cd mcp-pr-reviewer
npm install
cp .env.example .env
```

Fill in `.env`:

```
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_pat
ANTHROPIC_API_KEY=your_anthropic_key or AI_GATEWAY_API_KEY=your_ai_gateway_api_key
```

ReviewPilot connects to GitHub's hosted remote MCP server (`https://api.githubcopilot.com/mcp/`) over HTTP using your PAT, no local server process to run.

Start the app:

```bash
npm run dev
```

Visit `http://localhost:3000`, enter a public repo (e.g. `facebook/react`), and browse its open PRs.

## Project structure

```
app/
  page.tsx                                  # repo input + landing
  repo/[owner]/[repo]/page.tsx              # PR list
  repo/[owner]/[repo]/pr/[number]/page.tsx  # PR detail + review
  api/review/route.ts                       # runs the MCP call sequence and the LLM review

components/
  RepoPicker.tsx
  PullRequestList.tsx
  PullRequestCard.tsx
  ReviewSummaryCard.tsx
  CIStatusBadge.tsx

lib/
  mcp-client.ts       # MCP client setup
  github-tools.ts      # typed wrappers around the GitHub MCP tools used
  review-prompt.ts     # system prompt
  review-schema.ts     # Zod schema for the structured review output
```

## Known limitations

- **Large diffs may fail to load.** The GitHub MCP server's `get_diff` and a few other `pull_request_read` methods don't currently support pagination and can exceed response size limits on very large PRs. ReviewPilot falls back to a file-list-only summary in that case rather than failing the whole review.
- **Read-only.** ReviewPilot doesn't post comments back to GitHub. It's a review aid you read in the app, not an automated commenter.

## Roadmap

- Agentic natural-language repo Q&A ("does this repo have any open security alerts?") using `tool_choice: auto` over a curated read-only tool set.
- Post the review as a single top-level PR comment on request (not inline/line-anchored, see ARCHITECTURE.md for why).

## License

MIT
