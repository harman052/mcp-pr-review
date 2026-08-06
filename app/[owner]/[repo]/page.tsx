import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPullRequests } from "@/app/mcp/mcp-client";

export default async function PullRequestsList({
  params,
}: PageProps<"/[owner]/[repo]">) {
  const { owner, repo } = await params;
  const pullRequests = await getPullRequests({ owner, repo });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Open pull requests in {owner}/{repo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pullRequests.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No open pull requests found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pullRequests.map((pullRequest) => (
                <TableRow key={pullRequest.number}>
                  <TableCell>{pullRequest.number}</TableCell>
                  <TableCell>
                    <Link
                      href={`/${owner}/${repo}/pull/${pullRequest.number}`}
                      className="font-medium hover:underline"
                    >
                      {pullRequest.title}
                    </Link>
                  </TableCell>
                  <TableCell>{pullRequest.user?.login ?? "unknown"}</TableCell>
                  <TableCell>
                    {new Date(pullRequest.updated_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
