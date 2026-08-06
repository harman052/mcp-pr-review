"use client";

import { reviewSchema } from "@/app/mcp/mcp-client";
import { useEffect, use } from "react";
import { useObject } from "@ai-sdk/react";
import { CircleCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export default function PullRequestReview({
  params,
}: PageProps<"/[owner]/[repo]/pull/[pullNumber]">) {
  const { object, submit } = useObject({
    api: "/api/review",
    schema: reviewSchema,
  });

  const { owner, repo, pullNumber } = use(params);

  console.log("rendering");

  useEffect(() => {
    submit({ owner, repo, pullNumber });
  }, [owner, repo, pullNumber]);

  return (
    <div className="mb-60">
      <div className="mb-6">
        <h3 className="mt-6 mb-2 text-xl font-semibold">Overview</h3>
        <div className="text-sm">{object?.overview}</div>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Level</CardTitle>
            <CardDescription>{object?.riskLevel}</CardDescription>
          </CardHeader>
          <CardContent>{object?.riskReason}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CI Status</CardTitle>
            <CardDescription>
              {object?.ciStatus?.passing ? (
                <div className="flex gap-1">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  All checks passing
                </div>
              ) : (
                "Few checks are failing"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>{object?.ciStatus?.details}</CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h3 className="mt-8 mb-2 text-xl font-semibold">
          Files needing closer attention
        </h3>
        <div>
          {object?.filesToReview?.map((file) => {
            return (
              <Item className="mb-4" key={file?.path} size="sm" variant="muted">
                <ItemContent>
                  <ItemTitle>
                    <code>{file?.path}</code>
                  </ItemTitle>
                  <ItemDescription>{file?.reason}</ItemDescription>
                </ItemContent>
              </Item>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mt-6 text-xl font-semibold">Open Questions</h3>
        <ol className="list-decimal pl-6 text-sm font-normal">
          {object?.openQuestions?.map((question) => {
            return (
              <li key={question}>
                <Item size="xs">
                  <ItemContent>
                    <ItemTitle className="font-normal">{question}</ItemTitle>
                  </ItemContent>
                </Item>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
