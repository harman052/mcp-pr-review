"use client";

import { reviewSchema } from "@/app/mcp/mcp-client";
import { useEffect, use } from "react";
import { useObject } from "@ai-sdk/react";
import { RiskLevel } from "@/components/RiskLevel";
import { CIStatus } from "@/components/CIStatus";
import { FilesToReview } from "@/components/FilesToReview";
import { OpenQuestions } from "@/components/OpenQuestions";
import { Heading } from "@/components/Heading";

export default function PullRequestReview({
  params,
}: PageProps<"/[owner]/[repo]/pull/[pullNumber]">) {
  const { object, submit } = useObject({
    api: "/api/review",
    schema: reviewSchema,
  });

  const { owner, repo, pullNumber } = use(params);

  useEffect(() => {
    submit({ owner, repo, pullNumber });
  }, [owner, repo, pullNumber]);

  return (
    <div className="space-y-8">
      <Heading level={2}>Pull Request: #{pullNumber}</Heading>
      <Heading level={3}>Overview</Heading>
      <div className="text-sm">{object?.overview}</div>

      <Heading level={3}>Risk level and CI status</Heading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RiskLevel level={object?.riskLevel} reason={object?.riskReason} />

        <CIStatus
          passing={object?.ciStatus?.passing}
          details={object?.ciStatus?.details}
        />
      </div>

      <FilesToReview files={object?.filesToReview} />

      <OpenQuestions questions={object?.openQuestions} />
    </div>
  );
}
