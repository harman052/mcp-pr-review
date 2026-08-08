import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "./SkeletonCard";

export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-9 w-64" />

      <section className="space-y-3">
        <Skeleton className="h-7 w-32" />

        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-7 w-56" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-7 w-66" />

        <div className="flex w-full flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-7 w-40" />

        <ol className="flex w-full flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index}>
              <Skeleton className="h-5 w-full" />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
