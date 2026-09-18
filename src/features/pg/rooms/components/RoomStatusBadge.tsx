import { cn } from "@/shared/lib/utils";
import type { RoomStatus } from "../types/room.types";

interface RoomStatusBadgeProps {
    status: RoomStatus;
    className?: string;
}

export function RoomStatusBadge({ status, className }: RoomStatusBadgeProps) {
    const config: Record<
        RoomStatus,
        { label: string; bg: string; dot: string }
    > = {
        available: {
            label: "Available",
            bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
            dot: "bg-emerald-500",
        },
        occupied: {
            label: "Occupied",
            bg: "bg-neutral-900 text-white ring-1 ring-neutral-800",
            dot: "bg-neutral-400",
        },
        maintenance: {
            label: "Maintenance",
            bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
            dot: "bg-amber-500",
        },
    };

    const current = config[status] || {
        label: status,
        bg: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
        dot: "bg-neutral-400",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide shadow-2xs",
                current.bg,
                className
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", current.dot)} />
            {current.label}
        </span>
    );
}