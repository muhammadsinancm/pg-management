import { BookingStatus } from "../types/booking.types";

interface BookingStatusBadgeProps {
    status: BookingStatus
}

export function BookingStatusBadge({status}: BookingStatusBadgeProps) {
   const styles: Record<BookingStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-green-100 text-green-800',
    checked_out: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-800'
   }

   const labels: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    checked_in: 'Checked In',
    checked_out: 'Checked Out',
    cancelled: 'Cancelled'
   }

   return (
     <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
   )
}