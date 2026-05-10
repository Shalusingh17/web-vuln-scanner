import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Severity = "critical" | "high" | "medium" | "low" | "info";

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
  },
  high: {
    label: "High",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  },
  medium: {
    label: "Medium",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
  },
  low: {
    label: "Low",
    className: "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20",
  },
  info: {
    label: "Info",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  },
};

export default function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  const config = severityConfig[severity] ?? severityConfig.info;
  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}