import { GuestStatus } from "../types/guests.types";

interface GuestStatusBadgeProps {
    status: GuestStatus
}

export function GuestStatusBadge({ status }: GuestStatusBadgeProps) {
    const styles: Record<GuestStatus, string> = {
        active: 'bg-emerald-100 text-emerald-700',
        checked_out: 'bg-gray-100 text-gray-700',
        cancelled: 'bg-red-100 text-red-700'
    }

    const labels: Record<GuestStatus, string> = {
        active: 'Active',
        checked_out: 'Checked Out',
        cancelled: 'Cancelled'
    }

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
        >
            {labels[status]}
        </span>
    )
}