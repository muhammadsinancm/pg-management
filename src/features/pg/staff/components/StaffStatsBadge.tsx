import { StaffStatus } from "../types/staff.types";

export interface StaffStatsBadgeProps {
    status: StaffStatus;
    size?: "sm" | "md";
}

export function StaffStatsBadge({ status, size = "md" }: StaffStatsBadgeProps) {
    const isActive = status === "active";

    const sizeClasses =
        size === "sm"
            ? "px-2 py-0.5 text-[10px] font-semibold gap-1.5"
            : "px-2.5 py-1 text-xs font-semibold gap-2";

    const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

    return (
        <span
            className={`inline-flex items-center rounded-full border shadow-2xs ${
                isActive
                    ? "border-emerald-200/80 bg-emerald-50 text-emerald-700"
                    : "border-neutral-200 bg-neutral-100/80 text-neutral-600"
            } ${sizeClasses}`}
        >
            <span
                className={`rounded-full ${dotSize} ${
                    isActive ? "bg-emerald-500" : "bg-neutral-400"
                }`}
            />
            <span>{isActive ? "Active" : "Inactive"}</span>
        </span>
    );
}