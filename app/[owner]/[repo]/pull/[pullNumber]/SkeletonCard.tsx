import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            return (
              <div key={index}>
                <Skeleton className="h-6 w-full" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
