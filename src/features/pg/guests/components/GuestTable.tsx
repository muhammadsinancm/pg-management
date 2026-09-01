import { Guest } from "../types/guests.types";
import { GuestStatusBadge } from "./GuestStatusBadge";

interface GuestTableProps {
    guests: Guest[]
    onView: (guest: Guest) => void
    onEdit: (guest: Guest) => void
    onDelete: (guest: Guest) => void
}

export function GuestTable({guests, onView, onEdit, onDelete}: GuestTableProps) {
    return (
    <div className="overflow-x-auto rounded-xl border">

      <table className="w-full text-left text-sm">

        <thead className="border-b bg-muted/30">

          <tr>

            <th className="px-4 py-3">
              Guest
            </th>

            <th className="px-4 py-3">
              Phone
            </th>
            
            <th className="px-4 py-3">
              Floor
            </th>

            <th className="px-4 py-3">
              Room
            </th>

            <th className="px-4 py-3">
              Bed
            </th>

            <th className="px-4 py-3">
              Check In
            </th>

            <th className="px-4 py-3">
              Status
            </th>

            <th className="px-4 py-3">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {guests.map((guest) => (

            <tr
              key={guest.id}
              className="border-b"
            >

              <td className="px-4 py-3 font-medium">
                {guest.fullName}
              </td>

              <td className="px-4 py-3">
                {guest.phone}
              </td>

              <td className="px-4 py-3">
                {guest.floorName
                ? `${guest.floorName} (${guest.floorNumber ?? '-'})`
                : guest.floorNumber ?? '-'}
              </td>

              <td className="px-4 py-3">
                {guest.roomNumber ?? '-'}
              </td>

              <td className="px-4 py-3">
                {guest.bedNumber ?? '-'}
              </td>

              <td className="px-4 py-3">
                {guest.checkInDate ?? '-'}
              </td>

              <td className="px-4 py-3">
                <GuestStatusBadge
                  status={guest.status}
                />
              </td>

              <td className="px-4 py-3">

                <div className="flex gap-2">

                  <button
                    onClick={() => onView(guest)}
                    className="rounded border px-2 py-1 text-xs"
                  >
                    View
                  </button>

                  <button
                    onClick={() => onEdit(guest)}
                    className="rounded border px-2 py-1 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(guest)}
                    className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}