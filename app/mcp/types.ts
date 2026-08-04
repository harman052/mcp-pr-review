export interface Repo {
  owner: string;
  repo: string;
  state: string;
  sort: string;
  direction: "desc" | "asc";
  perPage?: number;
}

export interface PullRequest {
  owner: string;
  repo: string;
  pullNumber: number;
}

export interface CheckRun {
  name: string;
  status:
    | "queued"
    | "in_progress"
    | "completed"
    | "waiting"
    | "requested"
    | "pending";
  conclusion:
    | "success"
    | "failure"
    | "neutral"
    | "cancelled"
    | "skipped"
    | "timed_out"
    | "action_required"
    | null;
}

export interface GetPullRequest {
  title: string;
  body: string | null;
  state: "open" | "closed";
  user: {
    login: string;
  };
  base: {
    ref: string;
  };
  head: {
    ref: string;
  };
  created_at: string;
  updated_at: string;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface PullRequestFile {
  title: string;
  description: string;
  status:
    | "added"
    | "removed"
    | "modified"
    | "renamed"
    | "copied"
    | "changed"
    | "unchanged";
  additions: number;
  deletions: number;
}
