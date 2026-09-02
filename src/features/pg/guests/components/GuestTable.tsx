import { useState } from "react";
import { Guest } from "../types/guests.types";
import { GuestStatusBadge } from "./GuestStatusBadge";

interface GuestTableProps {
  guests: Guest[]
  onView: (guest: Guest) => void
  onEdit: (guest: Guest) => void
  onCheckOut: (guest: Guest) => Promise<void>
  onCancel: (guest: Guest) => Promise<void>
  onRemove: (guest: Guest) => Promise<void>
}

export function GuestTable({ guests, onView, onEdit, onCheckOut, onCancel, onRemove }: GuestTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'checked_out' | 'cancelled'>('all')

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.fullName.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter
    return matchesSearch && matchesStatus

  })

  return (
    <div className="overflow-hidden rounded-xl border">

      {/* Search & Filter */}
      <div className="mb-4 flex gap-3 p-4">

        <input
          type="text"
          placeholder="Search guest name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as
              | 'all'
              | 'active'
              | 'checked_out'
              | 'cancelled'
            )
          }
          className="rounded-md border px-3 py-2"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="checked_out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>

      </div>

      <table className="w-full">

        {/* TABLE HEADER */}
        <thead>

          <tr className="border-b bg-muted/30">

            <th className="px-4 py-3 text-left text-sm font-medium">
              Customers
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Phone
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Floor
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Room
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Bed
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Check In
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Actions
            </th>

          </tr>

        </thead>

        {/* TABLE BODY */}
        <tbody>

          {filteredGuests.map((guest) => (

            <tr
              key={guest.id}
              className="border-b last:border-b-0"
            >

              {/* GUEST */}
              <td className="px-4 py-3">
                {guest.fullName}
              </td>

              {/* PHONE */}
              <td className="px-4 py-3">
                {guest.phone}
              </td>

              {/* FLOOR */}
              <td className="px-4 py-3">

                {guest.floorName
                  ? `${guest.floorName}${guest.floorNumber !== undefined
                    ? ` (${guest.floorNumber})`
                    : ""
                  }`
                  : "-"
                }

              </td>

              {/* ROOM */}
              <td className="px-4 py-3">

                {guest.roomNumber
                  ? `Room ${guest.roomNumber}`
                  : "-"
                }

              </td>

              {/* BED */}
              <td className="px-4 py-3">

                {guest.bedNumber
                  ? `Bed ${guest.bedNumber}`
                  : "-"
                }

              </td>

              {/* CHECK IN */}
              <td className="px-4 py-3">
                {guest.checkInDate ?? "-"}
              </td>

              {/* STATUS */}
              <td className="px-4 py-3">
                <GuestStatusBadge status={guest.status} />
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3">

                <div className="flex gap-2">

                  {/* VIEW */}
                  <button
                    onClick={() => onView(guest)}
                    className="rounded-md border px-3 py-1 text-sm"
                  >
                    View
                  </button>

                  {/* EDIT */}
                  {guest.status === "active" && (
                    <button
                      onClick={() => onEdit(guest)}
                      className="rounded-md border px-3 py-1 text-sm"
                    >
                      Edit
                    </button>
                  )}

                  {/* CHECKOUT + CANCEL */}
                  {guest.status === "active" && (
                    <>
                      <button
                        onClick={() => onCheckOut(guest)}
                        className="rounded-md border px-3 py-1 text-sm"
                      >
                        Checkout
                      </button>

                      <button
                        onClick={() => onCancel(guest)}
                        className="rounded-md border px-3 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* REMOVE */}
                  {guest.status !== "active" && (
                    <button
                      onClick={() => onRemove(guest)}
                      className="rounded-md border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}

