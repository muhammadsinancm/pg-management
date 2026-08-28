import { BookingStatus } from "../types/booking.types"

interface BookingFiltersProps {
search: string
status: BookingStatus | 'all'
onSearchChange:(value: string) => void
onStatusChange: (value: BookingStatus | 'all') => void
}

export function BookingFilters({search, status, onSearchChange, onStatusChange}: BookingFiltersProps) {
    return (
         <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row">
      <input
        type="text"
        value={search}
        onChange={(event) =>
          onSearchChange(
            event.target.value
          )
        }
        placeholder="Search booking, customer or room..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      />

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value as
              | BookingStatus
              | "all"
          )
        }
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
      >
        <option value="all">
          All Status
        </option>

        <option value="pending">
          Pending
        </option>

        <option value="confirmed">
          Confirmed
        </option>

        <option value="checked_in">
          Checked In
        </option>

        <option value="checked_out">
          Checked Out
        </option>

        <option value="cancelled">
          Cancelled
        </option>
      </select>
    </div>
    )
}