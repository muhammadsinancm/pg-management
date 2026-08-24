import { RoomStatus } from "../types/room.types";

interface RoomStatusBadgeProps {
    status: RoomStatus
}

export function RoomStatusBadge({status}: RoomStatusBadgeProps) {

    const styles: Record<RoomStatus, string> = {
        available: 'bg-emerald-100 text-emerald-700',
        occupied: 'bg-blue-100 text-blue-700',
        maintenance: 'bg-amber-100 text-amber-700'
    }

    const labels: Record<RoomStatus, string> = {
        available: 'Available',
        occupied: 'Occupied',
        maintenance: 'Maintenance'
    }

    return (
         <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
    )

}