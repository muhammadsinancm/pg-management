import { Floor } from "../types/floor.types";

interface FloorCardProps {
    floor: Floor
    roomCount: number
    onViewRooms: (floor: Floor) => void
    onEdit: (floor: Floor) => void
    onDelete: (floor: Floor) => void
}

export function FloorCard({ floor, roomCount, onViewRooms, onEdit, onDelete }: FloorCardProps) {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-muted-foreground">
                        Floor {floor.floorNumber}
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                        {floor.name}
                    </h2>

                </div>

                <div className="rounded-lg bg-muted px-3 py-2">
                    🏢
                </div>

            </div>


            <div className="mt-6">

                <p className="text-sm text-muted-foreground">
                    Rooms
                </p>

                <p className="mt-1 text-2xl font-medium">
                    {roomCount}
                </p>

            </div>


            <div className="mt-6 flex gap-2">

                <button
                    type="button"
                    onClick={() =>
                        onViewRooms(floor)
                    }
                    className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                    View Rooms →
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onEdit(floor)
                    }
                    className="rounded-md border px-4 py-2 text-sm"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onDelete(floor)
                    }
                    className="rounded-md border px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                    Delete
                </button>

            </div>

        </div>
    )

}