import { BranchStatus } from "../types/branch.types";

interface BranchStatusBadgeProps {
    status: BranchStatus | string;
    size?: "sm" | "md";
}

export function BranchStatusBadge({ status, size = "md" }: BranchStatusBadgeProps) {
    const config: Record<
        string,
        { label: string; badge: string; dot: string }
    > = {
        active: {
            label: "Active",
            badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
            dot: "bg-emerald-500",
        },
        inactive: {
            label: "Inactive",
            badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
            dot: "bg-neutral-400",
        },
        maintenance: {
            label: "Maintenance",
            badge: "bg-amber-50 text-amber-800 border-amber-200/80",
            dot: "bg-amber-500",
        },
    };

    const current = config[status] || {
        label: typeof status === "string" ? status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Unknown",
        badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
        dot: "bg-neutral-400",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0 ${
                size === "sm"
                    ? "px-2 py-0.5 text-[10px]"
                    : "px-2.5 py-1 text-xs"
            } ${current.badge}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${current.dot}`} />
            {current.label}
        </span>
    );
}