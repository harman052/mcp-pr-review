import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-64" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
