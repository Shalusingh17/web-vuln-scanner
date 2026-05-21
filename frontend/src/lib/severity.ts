export type Severity = "critical" | "high" | "medium" | "low";

export const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

// Tailwind classes aligned to the theme variables in globals.css
export const severityPill: Record<Severity, string> = {
  critical:
    "border-red-500/35 bg-red-950/30 text-red-200",
  high:
    "border-orange-500/35 bg-orange-950/30 text-orange-200",
  medium:
    "border-yellow-500/35 bg-yellow-950/30 text-yellow-200",
  low:
    "border-blue-500/35 bg-blue-950/30 text-blue-200",
};

export const severityDot: Record<Severity, string> = {
  critical: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-blue-400",
};

