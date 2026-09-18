import { BedDouble, UserPlus, LogOut, Wrench, Check } from "lucide-react";
import type { Bed } from "../types/bed.types";

interface BedCardProps {
    bed: Bed;
    onAllocate: (bed: Bed) => void;
    onVacate: (bed: Bed) => void;
    onMaintenance: (bed: Bed) => void;
    onMakeAvailable: (bed: Bed) => void;
}

export function BedCard({
    bed,
    onAllocate,
    onVacate,
    onMaintenance,
    onMakeAvailable,
}: BedCardProps) {
    const statusConfig = {
        available: {
            label: "Available",
            badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
            dot: "bg-emerald-500",
        },
        occupied: {
            label: "Occupied",
            badge: "bg-neutral-900 text-white ring-1 ring-neutral-800",
            dot: "bg-neutral-400",
        },
        maintenance: {
            label: "Maintenance",
            badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
            dot: "bg-amber-500",
        },
    };

    const current = statusConfig[bed.status] || {
        label: bed.status,
        badge: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
        dot: "bg-neutral-400",
    };

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-neutral-200 hover:shadow-xs space-y-3">
            {/* Top row: Bed Number & Status */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100/90 text-neutral-700">
                        <BedDouble className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Bed
                        </p>
                        <h4 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                            {bed.bedNumber}
                        </h4>
                    </div>
                </div>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-2xs ${current.badge}`}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
                    {current.label}
                </span>
            </div>

            {/* Resident Info if occupied */}
            {bed.guestName ? (
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 text-xs space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Resident
                    </span>
                    <p className="font-bold text-neutral-900 truncate">
                        {bed.guestName}
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-neutral-100 bg-neutral-50/40 p-2 text-center text-xs text-neutral-400">
                    {bed.status === "maintenance"
                        ? "Under maintenance"
                        : "Ready for allocation"}
                </div>
            )}

            {/* Action Buttons */}
            <div>
                {bed.status === "available" && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => onAllocate(bed)}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-neutral-900 py-1.5 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer"
                        >
                            <UserPlus className="h-3 w-3" />
                            Allocate Bed
                        </button>
                        <button
                            type="button"
                            onClick={() => onMaintenance(bed)}
                            title="Set Maintenance"
                            aria-label={`Mark bed ${bed.bedNumber} for maintenance`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer shrink-0"
                        >
                            <Wrench className="h-3 w-3" />
                        </button>
                    </div>
                )}

                {bed.status === "occupied" && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => onVacate(bed)}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50/80 py-1.5 px-3 text-xs font-semibold text-red-700 shadow-2xs transition-all hover:bg-red-100 hover:text-red-800 cursor-pointer"
                        >
                            <LogOut className="h-3 w-3" />
                            Vacate Bed
                        </button>
                        <button
                            type="button"
                            onClick={() => onMaintenance(bed)}
                            title="Set Maintenance"
                            aria-label={`Mark bed ${bed.bedNumber} for maintenance`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer shrink-0"
                        >
                            <Wrench className="h-3 w-3" />
                        </button>
                    </div>
                )}

                {bed.status === "maintenance" && (
                    <button
                        type="button"
                        onClick={() => onMakeAvailable(bed)}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-1.5 px-3 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-700 cursor-pointer"
                    >
                        <Check className="h-3 w-3" />
                        Make Available
                    </button>
                )}
            </div>
        </div>
    );
}