import { PaymentStatus } from "../types/payment.types";

interface PaymentStatusBadgeProps {
    status: PaymentStatus | string;
    size?: "sm" | "md";
}

const statusConfig: Record<
    string,
    { label: string; badge: string; dot: string }
> = {
    completed: {
        label: "Completed",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        dot: "bg-emerald-500",
    },
    paid: {
        label: "Paid",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        dot: "bg-emerald-500",
    },
    pending: {
        label: "Pending",
        badge: "bg-amber-50 text-amber-800 border-amber-200/80",
        dot: "bg-amber-500",
    },
    failed: {
        label: "Failed",
        badge: "bg-red-50 text-red-800 border-red-200/80",
        dot: "bg-red-500",
    },
    refunded: {
        label: "Refunded",
        badge: "bg-purple-50 text-purple-800 border-purple-200/80",
        dot: "bg-purple-500",
    },
    partial: {
        label: "Partial",
        badge: "bg-amber-50 text-amber-800 border-amber-200/80",
        dot: "bg-amber-500",
    },
    cancelled: {
        label: "Cancelled",
        badge: "bg-neutral-100 text-neutral-600 border-neutral-200",
        dot: "bg-neutral-400",
    },
};

export function PaymentStatusBadge({ status, size = "md" }: PaymentStatusBadgeProps) {
    const s = typeof status === "string" ? status.toLowerCase().trim() : "";
    const current = statusConfig[s] || {
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