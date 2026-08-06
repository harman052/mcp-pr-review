export interface ParsedRepo {
  owner: string;
  repo: string;
}

// GitHub allows alphanumerics, hyphens, underscores and dots in owner/repo names
const SEGMENT = /^[\w.-]+$/;

/**
 * Accepts anything a user is likely to paste and pulls out owner/repo:
 *   https://github.com/vercel/next.js
 *   github.com/vercel/next.js.git
 *   https://github.com/vercel/next.js/pull/1234
 *   vercel/next.js
 * Returns null when the input isn't a GitHub repo reference.
 */
export function parseRepoUrl(input: string): ParsedRepo | null {
  const stripped = input
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "");

  const [owner, repo] = stripped.split("/").filter(Boolean);

  if (!owner || !repo) {
    return null;
  }

  const normalizedRepo = repo.replace(/\.git$/i, "");

  if (!SEGMENT.test(owner) || !SEGMENT.test(normalizedRepo)) {
    return null;
  }

  return { owner, repo: normalizedRepo };
}
