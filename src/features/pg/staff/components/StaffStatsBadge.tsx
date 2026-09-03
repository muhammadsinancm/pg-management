import { Staff } from "../types/staff.types";

interface StaffStatsBadge {
    status: Staff['status']
}

export function StaffStatsBadge({ status }: StaffStatsBadge) {
    const isActive = status === 'active'

    return (
        <span
            className={
                isActive
                    ? "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                    : "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            }
        >
            <span
                className={
                    isActive
                        ? "mr-2 h-2 w-2 rounded-full bg-green-500"
                        : "mr-2 h-2 w-2 rounded-full bg-gray-400"
                }
            />

            {isActive ? "Active" : "Inactive"}
        </span>
    )


}