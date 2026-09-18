import type { Bed } from "../types/bed.types";
import type { Room } from "../types/room.types";
import { BedList } from "./BedList";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomDetailsProps {
    room: Room;
    onAllocate: (bed: Bed) => void;
    onVacate: (bed: Bed) => void;
    onMaintenance: (bed: Bed) => void;
    onMakeAvailable: (bed: Bed) => void;
}

export function RoomDetails({
    room,
    onAllocate,
    onVacate,
    onMaintenance,
    onMakeAvailable,
}: RoomDetailsProps) {
    const beds = room.beds ?? [];

    const occupied = beds.filter((bed) => bed.status === "occupied").length;
    const available = beds.filter((bed) => bed.status === "available").length;
    const maintenance = beds.filter((bed) => bed.status === "maintenance").length;

    return (
        <div className="space-y-4">
            {/* Room Overview Card */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Room
                        </p>
                        <h1 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                            {room.roomNumber}
                        </h1>
                        <p className="mt-0.5 text-xs text-neutral-400">
                            {room.floorId ? `Floor ID: ${room.floorId}` : "Floor not specified"}
                        </p>
                    </div>

                    <RoomStatusBadge status={room.status} />
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
                    <Info label="Room Type" value={room.type} />
                    <Info label="Sharing Type" value={room.sharingType} />
                    <Info label="Total Capacity" value={`${room.capacity} Beds`} />
                    <Info
                        label="Monthly Rent"
                        value={`₹${Number(room.rent || 0).toLocaleString("en-IN")}`}
                    />
                </div>

                {room.description && (
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Description
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-700">
                            {room.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Bed Summary Stat Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                <Summary
                    label="Available Beds"
                    value={available}
                    color="text-emerald-700"
                />
                <Summary
                    label="Occupied Beds"
                    value={occupied}
                    color="text-neutral-900"
                />
                <Summary
                    label="Maintenance"
                    value={maintenance}
                    color="text-amber-700"
                />
            </div>

            {/* Beds Section */}
            <div className="space-y-2.5">
                <div className="px-0.5">
                    <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                        Beds Inventory
                    </h2>
                    <p className="text-xs text-neutral-400">
                        Manage resident allocations and bed maintenance for this room
                    </p>
                </div>

                <BedList
                    beds={beds}
                    onAllocate={onAllocate}
                    onVacate={onVacate}
                    onMaintenance={onMaintenance}
                    onMakeAvailable={onMakeAvailable}
                />
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                {label}
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-900 capitalize block">
                {value}
            </span>
        </div>
    );
}

function Summary({
    label,
    value,
    color = "text-neutral-900",
}: {
    label: string;
    value: number;
    color?: string;
}) {
    return (
        <div className="rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs space-y-1">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {label}
            </p>
            <p className={`text-lg sm:text-2xl font-bold tracking-tight ${color}`}>
                {value}
            </p>
        </div>
    );
}