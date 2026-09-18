import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import type { Room } from "../types/room.types";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomCardProps {
    room: Room;
    onView: (room: Room) => void;
    onEdit: (room: Room) => void;
    onDelete: (room: Room) => void;
}

export function RoomCard({ room, onView, onEdit, onDelete }: RoomCardProps) {
    const beds = room.beds ?? [];
    const occupiedBeds = beds.filter((bed) => bed.status === "occupied").length;
    const capacity = room.capacity || 1;
    const occupancyPercent = Math.min(100, Math.round((occupiedBeds / capacity) * 100));

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs space-y-3">
            {/* Top row: Room Number & Status */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Room
                    </p>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
                        {room.roomNumber}
                    </h3>
                </div>

                <RoomStatusBadge status={room.status} />
            </div>

            {/* Room Specs Grid */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-neutral-100/80 bg-neutral-50/70 p-2.5 text-xs">
                <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Type
                    </span>
                    <span className="font-bold text-neutral-800 capitalize">
                        {room.type}
                    </span>
                </div>

                <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Sharing
                    </span>
                    <span className="font-bold text-neutral-800 capitalize">
                        {room.sharingType}
                    </span>
                </div>

                <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Beds
                    </span>
                    <span className="font-bold text-neutral-800">
                        {occupiedBeds}/{capacity} Occupied
                    </span>
                </div>

                <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Rent
                    </span>
                    <span className="font-bold text-neutral-800">
                        ₹{Number(room.rent || 0).toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {/* Occupancy Progress Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-neutral-400">
                    <span>Bed Occupancy</span>
                    <span>{occupancyPercent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                        className="h-full rounded-full bg-neutral-900 transition-all duration-300"
                        style={{ width: `${occupancyPercent}%` }}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
                <button
                    type="button"
                    onClick={() => onView(room)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                >
                    View Beds
                    <ArrowRight className="h-3 w-3" />
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(room)}
                    title="Edit Room"
                    aria-label={`Edit room ${room.roomNumber}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer shrink-0"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(room)}
                    title="Delete Room"
                    aria-label={`Delete room ${room.roomNumber}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

export function RoomCardSkeleton() {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3 animate-pulse">
            {/* Top row: Room Number & Status */}
            <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                    <div className="h-2.5 w-10 rounded bg-neutral-200/80" />
                    <div className="mt-0.5 h-5 w-20 rounded-md bg-neutral-200" />
                </div>
                <div className="h-5 w-16 rounded-full bg-neutral-100" />
            </div>

            {/* Room Specs Grid (Type, Sharing, Beds, Rent) */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-neutral-100/80 bg-neutral-50/70 p-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <div className="h-2.5 w-10 rounded bg-neutral-200/70" />
                        <div className="h-3.5 w-16 rounded bg-neutral-200" />
                    </div>
                ))}
            </div>

            {/* Occupancy Progress Bar */}
            <div className="space-y-1">
                <div className="flex justify-between">
                    <div className="h-2.5 w-16 rounded bg-neutral-100" />
                    <div className="h-2.5 w-8 rounded bg-neutral-100" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
                <div className="h-8 flex-1 rounded-xl bg-neutral-900/10" />
                <div className="h-8 w-8 shrink-0 rounded-xl border border-neutral-100 bg-neutral-100/70" />
                <div className="h-8 w-8 shrink-0 rounded-xl border border-neutral-100 bg-neutral-100/70" />
            </div>
        </div>
    );
}