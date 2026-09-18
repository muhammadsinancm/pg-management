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
        <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white shadow-2xs">
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
    );
}