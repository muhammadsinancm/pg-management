import { Layers, ArrowRight, Pencil, Trash2 } from "lucide-react";
import type { Floor } from "../types/floor.types";

interface FloorCardProps {
    floor: Floor;
    roomCount: number;
    isLoadingRoomCount?: boolean;
    onViewRooms: (floor: Floor) => void;
    onEdit: (floor: Floor) => void;
    onDelete: (floor: Floor) => void;
}

export function FloorCard({
    floor,
    roomCount,
    isLoadingRoomCount = false,
    onViewRooms,
    onEdit,
    onDelete,
}: FloorCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs space-y-3.5 min-w-0">
            {/* Top row: Floor info & Icon */}
            <div className="flex items-start justify-between gap-2.5 sm:gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Floor {floor.floorNumber}
                    </p>
                    <h3 className="mt-0.5 truncate text-base font-bold tracking-tight text-neutral-900">
                        {floor.name}
                    </h3>
                </div>

                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100/90 text-neutral-700">
                    <Layers className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
            </div>

            {/* Room Count Stat Box */}
            <div className="flex items-center justify-between rounded-xl border border-neutral-100/80 bg-neutral-50/80 px-3 py-2 min-w-0">
                <span className="text-xs font-medium text-neutral-500">
                    Total Rooms
                </span>
                {isLoadingRoomCount ? (
                    <span className="h-4 w-6 rounded bg-neutral-200 animate-pulse inline-block" />
                ) : (
                    <span className="text-sm font-bold text-neutral-900">
                        {roomCount}
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5 min-w-0">
                <button
                    type="button"
                    onClick={() => onViewRooms(floor)}
                    className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2 px-2.5 sm:px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                >
                    <span className="truncate">View Rooms</span>
                    <ArrowRight className="h-3 w-3 shrink-0" />
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(floor)}
                    title="Edit Floor"
                    aria-label={`Edit ${floor.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer shrink-0"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(floor)}
                    title="Delete Floor"
                    aria-label={`Delete ${floor.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 shadow-2xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

export function FloorCardSkeleton() {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3.5 animate-pulse min-w-0">
            {/* Top row: Floor info & Icon */}
            <div className="flex items-start justify-between gap-2.5 sm:gap-3 min-w-0">
                <div className="min-w-0 flex-1 space-y-1.5">
                    {/* Floor number label skeleton */}
                    <div className="h-2.5 w-14 rounded bg-neutral-200/80" />
                    {/* Floor name skeleton */}
                    <div className="mt-1 h-5 w-32 max-w-[80%] rounded-md bg-neutral-200" />
                </div>

                {/* Layers Icon box skeleton */}
                <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-xl bg-neutral-100" />
            </div>

            {/* Room Count Stat Box */}
            <div className="flex items-center justify-between rounded-xl border border-neutral-100/80 bg-neutral-50/80 px-3 py-2 min-w-0">
                {/* Total Rooms label skeleton */}
                <div className="h-3 w-16 rounded bg-neutral-200/70" />
                {/* Total Rooms count skeleton */}
                <div className="h-4 w-6 rounded bg-neutral-200" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5 min-w-0">
                {/* View Rooms button skeleton */}
                <div className="h-8 flex-1 min-w-0 rounded-xl bg-neutral-900/10" />
                {/* Edit button skeleton */}
                <div className="h-8 w-8 shrink-0 rounded-xl border border-neutral-100 bg-neutral-100/70" />
                {/* Delete button skeleton */}
                <div className="h-8 w-8 shrink-0 rounded-xl border border-neutral-100 bg-neutral-100/70" />
            </div>
        </div>
    );
}