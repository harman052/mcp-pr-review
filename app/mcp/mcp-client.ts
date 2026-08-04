import { createMCPClient } from "@ai-sdk/mcp";
import { config } from "dotenv";
import { listPullRequests, readPullRequest } from "./github-tools.js";
import { generateText, streamText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT } from "./system-prompt.js";
import z from "zod";

config();

const reviewSchema = z.object({
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

async function main() {
  let mcpClient;

  try {
    mcpClient = await createMCPClient({
      transport: {
        type: "http",
        url: "https://api.githubcopilot.com/mcp/",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PAT}`,
        },
      },
    });

    // TODO: call it when user submits the repo URL
    //await listPullRequests(mcpClient);

    // TODO: call it when user selects a particular PR for review
    const contextBlock = await readPullRequest(mcpClient, {
      owner: "github",
      repo: "github-mcp-server",
      pullNumber: 2991,
    });

    if (!contextBlock) {
      throw new Error("Failed to build PR context");
    }

    const { output } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      output: Output.object({
        schema: reviewSchema,
      }),
      system: SYSTEM_PROMPT,
      prompt: contextBlock,
    });
    console.log("output", output);
  } catch (error) {
    console.error(error);
  } finally {
    await mcpClient?.close();
  }
}

main();
