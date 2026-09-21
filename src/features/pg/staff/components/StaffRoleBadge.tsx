import { StaffRole } from "../types/staff.types";

interface StaffRoleBadgeProps {
    role: StaffRole;
    size?: "sm" | "md";
}

const roleStyles: Record<StaffRole, string> = {
    manager: "border-indigo-200/80 bg-indigo-50 text-indigo-700",
    reception: "border-sky-200/80 bg-sky-50 text-sky-700",
    cook: "border-amber-200/80 bg-amber-50 text-amber-700",
    cleaner: "border-teal-200/80 bg-teal-50 text-teal-700",
    security: "border-purple-200/80 bg-purple-50 text-purple-700",
    maintenance: "border-orange-200/80 bg-orange-50 text-orange-700",
};

export function StaffRoleBadge({ role, size = "md" }: StaffRoleBadgeProps) {
    const formatted = role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    const style = roleStyles[role] || "border-neutral-200/80 bg-neutral-50 text-neutral-700";

    const sizeClasses =
        size === "sm"
            ? "px-2 py-0.5 text-[10px] font-semibold"
            : "px-2.5 py-1 text-xs font-semibold";

    return (
        <span
            className={`inline-flex items-center rounded-full border shadow-2xs ${style} ${sizeClasses}`}
        >
            {formatted}
        </span>
    );
}