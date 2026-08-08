import { AlertTriangle, CircleCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type RiskLevel = "Low" | "Medium" | "High";

interface RiskLevelProps {
  level?: RiskLevel;
  reason?: string;
}

const riskConfig = {
  Low: {
    label: "Low Risk",
    icon: CircleCheck,
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400",
  },
  Medium: {
    label: "Medium Risk",
    icon: AlertTriangle,
    className:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-400",
  },
  High: {
    label: "High Risk",
    icon: ShieldAlert,
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
  },
} satisfies Record<
  RiskLevel,
  {
    label: string;
    icon: typeof CircleCheck;
    className: string;
  }
>;

export function RiskLevel({ level, reason }: RiskLevelProps) {
  if (!level) {
    return (
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="text-sm text-muted-foreground">
          Risk level unavailable
        </div>
      </div>
    );
  }

  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-lg border p-4", config.className)}>
      <div className="flex items-center gap-2">
        <Icon className="size-5 shrink-0" />
        <span className="font-semibold">{config.label}</span>
      </div>

      {reason && <p className="mt-2 text-sm opacity-90">{reason}</p>}
    </div>
  );
}
