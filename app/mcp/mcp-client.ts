import { createMCPClient, type MCPClient } from "@ai-sdk/mcp";
import { anthropic } from "@ai-sdk/anthropic";
import { createTextStreamResponse, Output, streamText, toTextStream } from "ai";
import z from "zod";
import {
  listPullRequests,
  parseResponse,
  readPullRequest,
} from "./github-tools";
import { SYSTEM_PROMPT } from "./system-prompt";
import type { PullRequest, PullRequestListItem, Repo } from "./types";

export const reviewSchema = z.object({
  overview: z
    .string()
    .describe("One sentence on what the PR does, in plain language"),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  riskReason: z.string().describe("One sentence justifying the risk level"),
  ciStatus: z.object({
    passing: z.boolean(),
    details: z
      .string()
      .describe(
        "Which check failed and why, if any; otherwise a brief confirmation",
      ),
  }),
  filesToReview: z.array(
    z.object({
      path: z.string(),
      reason: z.string(),
    }),
  ),
  openQuestions: z.array(z.string()),
});

export type Review = z.infer<typeof reviewSchema>;

/**
 * Opens a connection to GitHub's MCP server, runs `work`, and always closes it.
 */
async function withMCPClient<T>(
  work: (client: MCPClient) => Promise<T>,
): Promise<T> {
  const githubPat = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  if (!githubPat) {
    throw new Error("GITHUB_PERSONAL_ACCESS_TOKEN is not set");
  }

  const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: "https://api.githubcopilot.com/mcp/",
      headers: {
        Authorization: `Bearer ${githubPat}`,
      },
    },
  });

  try {
    return await work(mcpClient);
  } finally {
    await mcpClient.close();
  }
}

export async function getPullRequests({
  owner,
  repo,
  state = "open",
  sort = "updated",
  direction = "desc",
  perPage = 30,
}: Pick<Repo, "owner" | "repo"> & Partial<Repo>) {
  return withMCPClient(async (client) => {
    const response = await listPullRequests(client, {
      owner,
      repo,
      state,
      sort,
      direction,
      perPage,
    });

    const payload = parseResponse(response);

    const pullRequests: Array<PullRequestListItem> = Array.isArray(payload)
      ? payload
      : (payload?.pull_requests ?? payload?.items ?? []);

    return pullRequests;
  });
}

export async function reviewPullRequest(pullRequestDetails: PullRequest) {
  return withMCPClient(async (client) => {
    const contextBlock = await readPullRequest(client, pullRequestDetails);

    if (!contextBlock) {
      throw new Error("Failed to build PR context");
    }

    const result = await streamText({
      model: anthropic("claude-haiku-4-5"),
      output: Output.object({
        schema: reviewSchema,
      }),
      system: SYSTEM_PROMPT,
      prompt: contextBlock,
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  });
}
