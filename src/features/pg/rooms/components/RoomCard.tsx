import { Room } from "../types/room.types";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomCardProps {
    room: Room
    onView: (room: Room) => void
    onEdit: (room: Room) => void
    onDelete: (room: Room) => void
}

export function RoomCard({ room, onView, onEdit, onDelete }: RoomCardProps) {
    const beds = room.beds ?? []

    const occupiedBeds = beds.filter((bed) => bed.status === 'occupied').length

    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Room
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                        {room.roomNumber}
                    </h3>
                </div>

                <RoomStatusBadge
                    status={room.status}
                />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-muted-foreground">
                        Floor
                    </p>

                    <p className="font-medium">
                        {room.floor || '-'}
                    </p>
                </div>

                <div>
                    <p className="text-muted-foreground">
                        Type
                    </p>

                    <p className="font-medium">
                        {room.type}
                    </p>
                </div>

                <div>
                    <p className="text-muted-foreground">
                        Sharing
                    </p>

                    <p className="font-medium">
                        {room.sharingType}
                    </p>
                </div>

                <div>
                    <p className="text-muted-foreground">
                        Rent
                    </p>

                    <p className="font-medium">
                        ₹{room.rent}
                    </p>
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">
                    Occupancy
                </p>

                <p className="text-sm font-medium">
                    {occupiedBeds} / {room.capacity}{' '}
                    beds occupied
                </p>
            </div>

            <div className="mt-5 flex gap-2">
                <button
                    type="button"
                    onClick={() => onView(room)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                >
                    View
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(room)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(room)}
                    className="rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground"
                >
                    Delete
                </button>
            </div>
        </div>

    )
}