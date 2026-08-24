import { Bed } from "../types/bed.types";
import { Room } from "../types/room.types";
import { BedList } from "./BedList";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomDetailsProps {
    room: Room
    onAllocate: (bed: Bed) => void
    onVacate: (bed: Bed) => void
    onMaintenance: (bed: Bed) => void

}

export function RoomDetails({ room, onAllocate, onVacate, onMaintenance }: RoomDetailsProps) {

    const beds = room.beds ?? []

    const occupied = beds.filter((bed) => bed.status === 'occupied').length
    const available = beds.filter((bed) => bed.status === 'available').length
    const maintenance = beds.filter((bed) => bed.status === 'maintenance').length

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-primary">
                            Room
                        </p>

                        <h1 className="mt-1 text-3xl font-semibold">
                            {room.roomNumber}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {room.floor || 'Floor not specified'}
                        </p>
                    </div>

                    <RoomStatusBadge
                        status={room.status}
                    />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Info
                        label="Type"
                        value={room.type}
                    />

                    <Info
                        label="Sharing"
                        value={room.sharingType}
                    />

                    <Info
                        label="Capacity"
                        value={String(room.capacity)}
                    />

                    <Info
                        label="Monthly rent"
                        value={`₹${room.rent}`}
                    />
                </div>

                {room.description && (
                    <div className="mt-6">
                        <p className="text-sm font-medium">
                            Description
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {room.description}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Summary
                    label="Available"
                    value={available}
                />

                <Summary
                    label="Occupied"
                    value={occupied}
                />

                <Summary
                    label="Maintenance"
                    value={maintenance}
                />
            </div>

            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                        Beds
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage bed allocation for this
                        room.
                    </p>
                </div>

                <BedList
                    beds={beds}
                    onAllocate={onAllocate}
                    onVacate={onVacate}
                    onMaintenance={
                        onMaintenance
                    }
                />
            </section>
        </div>
    )

}

function Info({ label, value }: { label: string, value: string }) {
    return (
        <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold">
                {value}
            </p>
        </div>

    )
}

function Summary({ label, value }: { label: string, value: number }) {
    return (
        <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-2xl font-semibold">
                {value}
            </p>
        </div>

    )
}