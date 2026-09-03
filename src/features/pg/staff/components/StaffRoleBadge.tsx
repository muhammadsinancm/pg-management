import { Staff } from "../types/staff.types";

interface StaffRoleBadgeProps {
    role: Staff['role']
}

export function StaffRoleBadge({ role }: StaffRoleBadgeProps) {
    function formatRole(role: Staff['role']) {
        return role.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
    }
    return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {formatRole(role)}
        </span>
    )
}