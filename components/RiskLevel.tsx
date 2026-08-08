import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CircleCheck, ShieldAlert } from "lucide-react";
import { StatusCard, loadingStatus } from "./StatusCard";

type RiskLevelValue = "Low" | "Medium" | "High";

interface RiskLevelProps {
  level?: RiskLevelValue;
  reason?: string;
  isLoading: boolean;
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
  RiskLevelValue,
  {
    label: string;
    icon: LucideIcon;
    className: string;
  }
> satisfies Record<
  RiskLevelValue,
  Omit<typeof loadingStatus, "label"> & {
    label: string;
  }
>;

export function RiskLevel({ level, reason, isLoading }: RiskLevelProps) {
  if (isLoading && level === undefined) {
    return <StatusCard {...loadingStatus} label="Loading risk level" />;
  }

  if (level === undefined) {
    return (
      <StatusCard
        label="Risk level unavailable"
        icon={loadingStatus.icon}
        className={loadingStatus.className}
      />
    );
  }

  return <StatusCard {...riskConfig[level]} reason={reason} />;
}
