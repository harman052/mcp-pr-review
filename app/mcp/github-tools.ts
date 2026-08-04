import { CallToolResult, MCPClient } from "@ai-sdk/mcp";
import {
  CheckRun,
  GetPullRequest,
  PullRequest,
  PullRequestFile,
  Repo,
} from "./types.js";

export function parseResponse(response: CallToolResult) {
  if ("content" in response && !response.isError) {
    const [content] = response.content as Array<{
      type: string;
      text?: string;
    }>;
    if (content?.type === "text" && content.text) {
      try {
        return JSON.parse(content.text);
      } catch {
        return content.text;
      }
    }
  }
}

export async function getPullRequestMetadata(
  client: MCPClient,
  { owner, repo, pullNumber }: PullRequest,
) {
  const response: CallToolResult = await client.callTool({
    name: "pull_request_read",
    arguments: {
      method: "get",
      owner,
      repo,
      pullNumber,
    },
  });

  const payload = parseResponse(response) as GetPullRequest;

  const context: Array<string> = [];
  context.push(`    
    \n=== Pull Request metadata ===\n
        ${JSON.stringify({
          title: payload.title,
          body: payload.body,
          state: payload.state,
          userLogin: payload.user.login,
          baseRef: payload.base.ref,
          headRef: payload.head.ref,
          created_at: payload.created_at,
          updated_at: payload.updated_at,
          additions: payload.additions,
          deletions: payload.deletions,
          changed_files: payload.changed_files,
        })},
      `);

  return context.join("\n");
}

export async function getCheckRuns(
  client: MCPClient,
  { owner, repo, pullNumber }: PullRequest,
) {
  const response: CallToolResult = await client.callTool({
    name: "pull_request_read",
    arguments: {
      method: "get_check_runs",
      owner,
      repo,
      pullNumber,
    },
  });
  const payload = parseResponse(response) as {
    total_count: number;
    check_runs: Array<CheckRun>;
  };

  const result = payload.check_runs.map(({ name, status, conclusion }) => ({
    name,
    status,
    conclusion,
  }));

  const failedChecks = result.filter(
    (checkRun) => checkRun.conclusion === "failure",
  );

  const context: Array<string> = [];
  context.push("\n=== Check Runs ===\n");

  if (failedChecks.length > 0) {
    context.push(
      `Pull request #${pullNumber} has ${failedChecks.length} failed checks out of total ${payload.total_count}`,
    );
  }
  context.push("\nCheck run results:");
  context.push(JSON.stringify(result));

  return context.join("\n");
}

export async function getFiles(
  client: MCPClient,
  { owner, repo, pullNumber }: PullRequest,
) {
  const response: CallToolResult = await client.callTool({
    name: "pull_request_read",
    arguments: {
      method: "get_files",
      owner,
      repo,
      pullNumber,
    },
  });

  const payload = parseResponse(response) as Array<PullRequestFile>;

  const result = payload.map(
    ({ title, description, status, additions, deletions }) => ({
      title,
      description,
      status,
      additions,
      deletions,
    }),
  );

  const context: Array<string> = [];
  context.push("\n=== Pull Request Files ===\n");
  context.push(`Number of files changed: ${result.length}\n`);
  context.push(`Files metadata:\n`);
  context.push(JSON.stringify(result));

  return context.join("\n");
}

export async function getDiff(
  client: MCPClient,
  { owner, repo, pullNumber }: PullRequest,
) {
  const response: CallToolResult = await client.callTool({
    name: "pull_request_read",
    arguments: {
      method: "get_diff",
      owner,
      repo,
      pullNumber,
    },
  });

  const payload = parseResponse(response) as string;

  const context: Array<string> = [];
  context.push("\n=== Files Diff ===\n");
  context.push(JSON.stringify(payload));

  return context.join("\n");
}

export async function listPullRequests(
  client: MCPClient,
  { owner, repo, state, sort, direction, perPage }: Repo,
) {
  const result = await client.callTool({
    name: "list_pull_requests",
    arguments: {
      owner,
      repo,
      state,
      sort,
      direction,
      perPage,
    },
  });

  return result;
}

export async function readPullRequest(
  client: MCPClient,
  pullRequestDetails: PullRequest,
) {
  try {
    const pullRequestMetadata = await getPullRequestMetadata(
      client,
      pullRequestDetails,
    );
    const checkRunResult = await getCheckRuns(client, pullRequestDetails);
    const files = await getFiles(client, pullRequestDetails);
    const diff = await getDiff(client, pullRequestDetails);

    const pullRequestContext: Array<string> = [
      pullRequestMetadata,
      checkRunResult,
      files,
      diff,
    ];

    return pullRequestContext.join("\n");
  } catch (error) {
    console.error(error);
  }
}
