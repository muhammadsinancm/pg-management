import { useState } from "react";
import { Guest } from "../types/guests.types";
import { GuestStatusBadge } from "./GuestStatusBadge";

interface GuestTableProps {
  guests: Guest[]
  onView: (guest: Guest) => void
  onEdit: (guest: Guest) => void
}

export function GuestTable({ guests, onView, onEdit }: GuestTableProps) {
  const [search, setSearch] = useState('')

  const filteredGuests = guests.filter((guest) => {
    const searchValue = search.toLowerCase().trim()

    const matchesSearch = guest.fullName.toLowerCase().includes(searchValue) ||
    guest.phone.toLowerCase().includes(searchValue) ||
    guest.email?.toLowerCase().includes(searchValue)

    return matchesSearch

  })

  return (
        <div className="overflow-hidden rounded-xl border">

            {/* Search & Filter */}
            <div className="mb-4 flex gap-3 p-4">

                <input
                    type="text"
                    placeholder="Search guest..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 rounded-md border px-3 py-2"
                />

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full">

                    {/* TABLE HEADER */}
                    <thead>
                        <tr className="border-b bg-muted/30">

                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Guest
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Phone
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-medium">
                                Email
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-medium">
                                ID
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

                        {filteredGuests.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                                >
                                    No guests found
                                </td>
                            </tr>
                        ) : (
                            filteredGuests.map((guest) => (

                                <tr
                                    key={guest.id}
                                    className="border-b last:border-b-0"
                                >

                                    {/* GUEST */}
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium">
                                                {guest.fullName}
                                            </p>

                                            {guest.gender && (
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {guest.gender}
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* PHONE */}
                                    <td className="px-4 py-3">
                                        {guest.phone}
                                    </td>

                                    {/* EMAIL */}
                                    <td className="px-4 py-3">
                                        {guest.email || "-"}
                                    </td>

                                    {/* ID */}
                                    <td className="px-4 py-3">
                                        {guest.idNumber ? (
                                            <div>
                                                <p className="text-sm">
                                                    {guest.idNumber}
                                                </p>

                                                {guest.idType && (
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {guest.idType.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-3">
                                        <GuestStatusBadge
                                            status={guest.status}
                                        />
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3">

                                        <div className="flex flex-wrap gap-2">

                                            {/* VIEW */}
                                            <button
                                                onClick={() =>
                                                    onView(guest)
                                                }
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                View
                                            </button>

                                            {/* EDIT */}
                                            {guest.status === "active" && (
                                                <button
                                                    onClick={() =>
                                                        onEdit(guest)
                                                    }
                                                    className="rounded-md border px-3 py-1 text-sm"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            
                                        </div>

                                    </td>

                                </tr>

                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    )

}

