import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Room } from "../types/room.types";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomTableProps {
    rooms: Room[];
    onView: (room: Room) => void;
    onEdit: (room: Room) => void;
    onDelete: (room: Room) => void;
}

export function RoomTable({ rooms, onView, onEdit, onDelete }: RoomTableProps) {
    if (rooms.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center shadow-2xs">
                <p className="text-xs sm:text-sm font-semibold text-neutral-700">
                    No rooms found
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">
                    No rooms match your search or this floor has no rooms yet.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Mobile View: Responsive Card List (visible on screens < md) */}
            <div className="space-y-3 md:hidden">
                {rooms.map((room) => {
                    const occupied = (room.beds ?? []).filter(
                        (bed) => bed.status === "occupied"
                    ).length;

                    return (
                        <div
                            key={room.id}
                            className="rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-2xs transition-all hover:border-neutral-200 min-w-0"
                        >
                            {/* Card Header: Room Number & Status */}
                            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2.5 min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                        Room
                                    </span>
                                    <span className="text-sm font-bold text-neutral-900 truncate">
                                        {room.roomNumber}
                                    </span>
                                </div>
                                <RoomStatusBadge status={room.status} size="sm" />
                            </div>

                            {/* Details Grid: Type, Sharing, Beds, Rent */}
                            <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-xl bg-neutral-50/70 p-2.5 text-xs">
                                <div className="min-w-0">
                                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Type
                                    </span>
                                    <span className="mt-0.5 block font-bold text-neutral-800 capitalize truncate">
                                        {room.type}
                                    </span>
                                </div>

                                <div className="min-w-0">
                                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Sharing
                                    </span>
                                    <span className="mt-0.5 block font-bold text-neutral-800 capitalize truncate">
                                        {room.sharingType}
                                    </span>
                                </div>

                                <div className="min-w-0">
                                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Beds
                                    </span>
                                    <span className="mt-0.5 block font-bold text-neutral-800 truncate">
                                        {occupied}/{room.capacity} beds
                                    </span>
                                </div>

                                <div className="min-w-0">
                                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Rent
                                    </span>
                                    <span className="mt-0.5 block font-bold text-neutral-900 truncate">
                                        ₹{Number(room.rent || 0).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="mt-3 flex items-center gap-2 pt-1 border-t border-neutral-100 min-w-0">
                                <button
                                    type="button"
                                    onClick={() => onView(room)}
                                    className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                                >
                                    <Eye className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">View Beds</span>
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
                })}
            </div>

            {/* Desktop View: 7-Column Table (visible on md screens and up) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            <tr>
                                <th className="px-4 py-3">Room</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Sharing</th>
                                <th className="px-4 py-3">Beds</th>
                                <th className="px-4 py-3">Rent</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-100">
                            {rooms.map((room) => {
                                const occupied = (room.beds ?? []).filter(
                                    (bed) => bed.status === "occupied"
                                ).length;

                                return (
                                    <tr
                                        key={room.id}
                                        className="transition-colors hover:bg-neutral-50/50"
                                    >
                                        <td className="px-4 py-3 font-bold text-neutral-900">
                                            {room.roomNumber}
                                        </td>

                                        <td className="px-4 py-3 text-neutral-600 capitalize">
                                            {room.type}
                                        </td>

                                        <td className="px-4 py-3 text-neutral-600 capitalize">
                                            {room.sharingType}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="font-bold text-neutral-900">
                                                {occupied}
                                            </span>
                                            <span className="text-neutral-400">
                                                /{room.capacity} beds
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 font-semibold text-neutral-900">
                                            ₹{Number(room.rent || 0).toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-4 py-3">
                                            <RoomStatusBadge status={room.status} />
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => onView(room)}
                                                    title="View Details"
                                                    aria-label={`View details for room ${room.roomNumber}`}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(room)}
                                                    title="Edit Room"
                                                    aria-label={`Edit room ${room.roomNumber}`}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(room)}
                                                    title="Delete Room"
                                                    aria-label={`Delete room ${room.roomNumber}`}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}