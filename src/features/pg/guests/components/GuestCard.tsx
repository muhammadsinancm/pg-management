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

            <div className="mt-5 grid grid-cols-2 gap-4">

                <div>
                    <p className="text-xs text-muted-foreground">
                        Room
                    </p>

                    <p className="font-medium">
                        {guest.roomNumber ?? '-'}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-muted-foreground">
                        Bed
                    </p>

                    <p className="font-medium">
                        {guest.bedNumber ?? '-'}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-muted-foreground">
                        Check In
                    </p>

                    <p className="font-medium">
                        {guest.checkInDate ?? '-'}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-muted-foreground">
                        Expected Checkout
                    </p>

                    <p className="font-medium">
                        {guest.expectedCheckOutDate ?? '-'}
                    </p>
                </div>

            </div>

            <div className="mt-5 flex gap-2">

                <button
                    onClick={() => onView(guest)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                >
                    View
                </button>

                <button
                    onClick={() => onEdit(guest)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                >
                    Edit
                </button>

                <button
                    onClick={() => onDelete(guest)}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
                >
                    Delete
                </button>

            </div>

        </div>
    )
}