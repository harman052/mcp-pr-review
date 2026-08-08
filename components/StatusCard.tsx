import type { LucideIcon } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  label: string;
  icon: LucideIcon;
  className: string;
  reason?: string;
}

export function StatusCard({
  label,
  icon: Icon,
  className,
  reason,
}: StatusCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <div className="flex items-center gap-2">
        <Icon className="size-5 shrink-0" />
        <span className="font-semibold">{label}</span>
      </div>

      {reason && <p className="mt-2 text-sm opacity-90">{reason}</p>}
    </div>
  );
}

export const loadingStatus = {
  label: "Loading",
  icon: LoaderCircle,
  className: "border-muted bg-muted/50 text-muted-foreground",
};
