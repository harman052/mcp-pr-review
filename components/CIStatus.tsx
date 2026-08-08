import { CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

interface CIStatusProps {
  passing?: boolean;
  details?: string;
}

export function CIStatus({ passing, details }: CIStatusProps) {
  const config =
    passing === undefined
      ? {
          label: "CI status unavailable",
          icon: CircleX,
          className: "border-muted bg-muted/50 text-muted-foreground",
        }
      : passing
        ? {
            label: "All checks passing",
            icon: CircleCheck,
            className:
              "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400",
          }
        : {
            label: "Checks failing",
            icon: CircleX,
            className:
              "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
          };

  const Icon = config.icon;

  return (
    <div className={cn("rounded-lg border p-4", config.className)}>
      <div className="flex items-center gap-2">
        <Icon className="size-5 shrink-0" />
        <span className="font-semibold">{config.label}</span>
      </div>

      {details && <p className="mt-2 text-sm opacity-90">{details}</p>}
    </div>
  );
}
