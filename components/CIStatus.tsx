import { CircleCheck, CircleX } from "lucide-react";
import { StatusCard, loadingStatus } from "./StatusCard";

interface CIStatusProps {
  passing?: boolean;
  details?: string;
  isLoading: boolean;
}

export function CIStatus({ passing, details, isLoading }: CIStatusProps) {
  if (isLoading && passing === undefined) {
    return <StatusCard {...loadingStatus} label="Loading CI status" />;
  }

  if (passing === undefined) {
    return (
      <StatusCard
        label="CI status unavailable"
        icon={CircleX}
        className="border-muted bg-muted/50 text-muted-foreground"
      />
    );
  }

  if (passing) {
    return (
      <StatusCard
        label="All checks passing"
        icon={CircleCheck}
        className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
        reason={details}
      />
    );
  }

  return (
    <StatusCard
      label="Checks failing"
      icon={CircleX}
      className="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
      reason={details}
    />
  );
}
