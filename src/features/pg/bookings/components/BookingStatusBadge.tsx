import { BookingStatus } from "../types/booking.types";

interface BookingStatusBadgeProps {
    status: BookingStatus;
    size?: "sm" | "md";
}

export function BookingStatusBadge({ status, size = "md" }: BookingStatusBadgeProps) {
    const config: Record<
        BookingStatus,
        { label: string; badge: string; dot: string }
    > = {
        pending: {
            label: "Pending",
            badge: "bg-amber-50 text-amber-800 border-amber-200/80",
            dot: "bg-amber-500",
        },
        confirmed: {
            label: "Confirmed",
            badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
            dot: "bg-emerald-500",
        },
        checked_in: {
            label: "Checked In",
            badge: "bg-blue-50 text-blue-800 border-blue-200/80",
            dot: "bg-blue-500",
        },
        checked_out: {
            label: "Checked Out",
            badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
            dot: "bg-neutral-400",
        },
        cancelled: {
            label: "Cancelled",
            badge: "bg-red-50 text-red-800 border-red-200/80",
            dot: "bg-red-500",
        },
    };

    const current = config[status] || {
        label: status,
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