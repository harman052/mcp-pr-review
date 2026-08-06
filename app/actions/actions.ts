"use server";

import { redirect } from "next/navigation";
import { parseRepoUrl } from "@/lib/parse-repo-url";
import { reviewPullRequest } from "../mcp/mcp-client";
import { PullRequest } from "../mcp/types";

export interface RepoFormState {
  error?: string;
}

export async function submitRepoUrl(
  _prevState: RepoFormState,
  formData: FormData,
): Promise<RepoFormState> {
  const repoUrl = formData.get("repoUrl");
  const parsed = typeof repoUrl === "string" ? parseRepoUrl(repoUrl) : null;

  if (!parsed) {
    return {
      error: "Enter a repository URL like https://github.com/vercel/next.js",
    };
  }

  // The pull request list page reads owner/repo off the URL and calls the MCP server
  redirect(`/${parsed.owner}/${parsed.repo}`);
}
