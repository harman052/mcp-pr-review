export const output = {
  overview:
    "Adds a new non-default 'governance' toolset with 5 tools for reading and creating GitHub repository rulesets at the repository, organization, and enterprise levels.",
  riskLevel: "Medium",
  riskReason:
    "The write tools (create_repository_ruleset, create_organization_repository_ruleset, create_enterprise_repository_ruleset) can mutate security-sensitive branch protection policies, and the ruleset construction path uses a JSON marshal/unmarshal round-trip through go-github types that silently drops unrecognized rule types, relying on a post-hoc validation check rather than direct API field mapping.",
  ciStatus: {
    passing: false,
    details:
      "8 checks are failing: 'lint', 'mcp-diff-http', 'mcp-diff', 'docs-check', 'build', 'build (windows-latest)', 'build (macos-latest)', and 'build (ubuntu-latest)'. The build failures across all platforms strongly suggest a compilation error (possibly a missing registration, import, or type mismatch) introduced by this PR. The docs-check and mcp-diff failures suggest generated documentation or MCP schema snapshots are out of sync with the code changes.",
  },
  filesToReview: [
    {
      path: "pkg/github/rulesets.go",
      reason:
        "Core implementation file — the buildRepositoryRulesetFromArgs function uses a JSON marshal→unmarshal round-trip through github.RepositoryRuleset to construct the API payload, which means unrecognized rule types are silently dropped and only caught by the post-hoc rulesetAppliedRuleTypes check; reviewers should verify this guard is exhaustive and that go-github v87 actually exposes all expected rule types. The ListRepositoryRuleSuites and GetRepositoryRuleSuite functions bypass go-github entirely with raw HTTP requests, which sidesteps SDK error handling conventions.",
    },
    {
      path: "pkg/github/tools.go",
      reason:
        "Registers the new toolset and all 5 tools in AllTools(); the failing build checks may be rooted here if ToolsetMetadataGovernance or any of the new tool constructors have a type or import mismatch.",
    },
    {
      path: "pkg/scopes/scopes.go",
      reason:
        "Adds new ReadEnterprise and AdminEnterprise scope constants and extends ScopeHierarchy; any error here could affect the scope-challenge middleware for all tools, not just the new governance ones.",
    },
    {
      path: "pkg/github/rulesets_test.go",
      reason:
        "486-line test file — covers the main happy and error paths, but reviewers should confirm tests for enterprise-level create are sufficient and that the unsupported-rule-type guard (Test_CreateRepositoryRuleset_UnsupportedRuleType) is tested at org and enterprise levels as well.",
    },
    {
      path: "pkg/github/__toolsnaps__/create_repository_ruleset.snap",
      reason:
        "Snapshot for create_repository_ruleset shows target enum of [branch, tag, push] (no 'repository'), while org/enterprise snaps include 'repository' — reviewers should confirm this asymmetry is intentional per the GitHub API.",
    },
  ],
  openQuestions: [
    "What is causing the build failures on all platforms (ubuntu, macos, windows)? Is there a missing import, unresolved symbol, or generated file that needs to be regenerated?",
    "The docs-check and mcp-diff failures suggest generated artifacts are stale — were script/generate-docs and any MCP schema generation scripts run against the latest commit pushed to this branch, or only locally?",
    "The ruleset construction for all three create tools goes through a single buildRepositoryRulesetFromArgs that does not distinguish between repo/org/enterprise contexts — is there any API-level field that is valid at one level but not another (e.g., conditions, bypass_actors) that could silently produce an invalid request?",
    "ListRepositoryRuleSuites and GetRepositoryRuleSuite issue raw HTTP requests instead of using go-github methods — is this intentional because go-github v87 doesn't expose these endpoints, and if so, is there a tracking issue to migrate when support is added?",
    "The organization ruleset read tool accepts pagination parameters (page/perPage) in its schema but the org 'get' method only fetches a single ruleset by ID — will the pagination params simply be ignored on 'get', and should the schema make this clear?",
    "Are there integration or end-to-end tests for the enterprise-level create tool, given that enterprise API access requires special token scopes that may not be exercised in unit tests?",
  ],
};
