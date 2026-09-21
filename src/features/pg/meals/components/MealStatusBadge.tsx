import { MealStatus } from "../types/meal.types";

interface MealStatusBadgeProps {
    status: MealStatus | string;
    size?: "sm" | "md";
}

export function MealStatusBadge({ status, size = "md" }: MealStatusBadgeProps) {
    const config: Record<
        MealStatus,
        { label: string; badge: string; dot: string }
    > = {
        scheduled: {
            label: "Scheduled",
            badge: "bg-amber-50 text-amber-800 border-amber-200/80",
            dot: "bg-amber-500",
        },
        served: {
            label: "Served",
            badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
            dot: "bg-emerald-500",
        },
        cancelled: {
            label: "Cancelled",
            badge: "bg-red-50 text-red-800 border-red-200/80",
            dot: "bg-red-500",
        },
    };

    const current = config[status as MealStatus] || {
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

export default MealStatusBadge;
