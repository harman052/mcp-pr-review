import { reviewPullRequest } from "@/app/mcp/mcp-client";

export async function POST(request: Request) {
  const pullRequest = await request.json();
  const response = await reviewPullRequest(pullRequest);
  return response;
}
