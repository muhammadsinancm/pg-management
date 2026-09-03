import { Guest } from "../types/guests.types";
import { GuestStatusBadge } from "./GuestStatusBadge";

interface GuestCardProps {
    guest: Guest
    onView: (guest: Guest) => void
    onEdit: (guest: Guest) => void
    onDelete: (guest: Guest) => void
}

export function GuestCard({ guest, onView, onEdit, onDelete }: GuestCardProps) {
    return (

        <div className="rounded-xl border bg-card p-5 shadow-sm">

            {/* =============================== */}
            {/* GUEST INFORMATION */}
            {/* =============================== */}

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-xs text-muted-foreground">
                        Guest
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                        {guest.fullName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        {guest.phone}
                    </p>

                </div>

                <GuestStatusBadge
                    status={guest.status}
                />

            </div>


            {/* =============================== */}
            {/* CONTACT INFORMATION */}
            {/* =============================== */}

            <div className="mt-5 grid grid-cols-2 gap-4">

                <div>

                    <p className="text-xs text-muted-foreground">
                        Email
                    </p>

                    <p className="font-medium">
                        {guest.email ?? '-'}
                    </p>

                </div>


                <div>

                    <p className="text-xs text-muted-foreground">
                        Gender
                    </p>

                    <p className="font-medium capitalize">
                        {guest.gender ?? '-'}
                    </p>

                </div>


                <div>

                    <p className="text-xs text-muted-foreground">
                        ID Type
                    </p>

                    <p className="font-medium">
                        {guest.idType ?? '-'}
                    </p>

                </div>


                <div>

                    <p className="text-xs text-muted-foreground">
                        ID Number
                    </p>

                    <p className="font-medium">
                        {guest.idNumber ?? '-'}
                    </p>

                </div>

            </div>


            {/* =============================== */}
            {/* ADDRESS */}
            {/* =============================== */}

            <div className="mt-5">

                <p className="text-xs text-muted-foreground">
                    Address
                </p>

                <p className="font-medium">
                    {guest.city || guest.state
                        ? `${guest.city ?? ''}${guest.city && guest.state ? ', ' : ''}${guest.state ?? ''}`
                        : '-'}
                </p>

            </div>


            {/* =============================== */}
            {/* ACTIONS */}
            {/* =============================== */}

            <div className="mt-5 flex gap-2">

                <button
                    type="button"
                    onClick={() => onView(guest)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                >
                    View
                </button>


                <button
                    type="button"
                    onClick={() => onEdit(guest)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                >
                    Edit
                </button>


                <button
                    type="button"
                    onClick={() => onDelete(guest)}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
                >
                    Delete
                </button>

            </div>

        </div>
    )
}