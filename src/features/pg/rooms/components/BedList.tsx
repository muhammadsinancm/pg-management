import { BedDouble } from "lucide-react";
import type { Bed } from "../types/bed.types";
import { BedCard } from "./BedCard";

interface BedListProps {
    beds: Bed[];
    onAllocate: (bed: Bed) => void;
    onVacate: (bed: Bed) => void;
    onMaintenance: (bed: Bed) => void;
    onMakeAvailable: (bed: Bed) => void;
}

export function BedList({
    beds,
    onAllocate,
    onVacate,
    onMaintenance,
    onMakeAvailable,
}: BedListProps) {
    if (!beds.length) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center shadow-2xs">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                    <BedDouble className="h-5 w-5" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-neutral-900">
                    No Beds Configured
                </h3>
                <p className="mt-0.5 text-xs text-neutral-400">
                    No beds are currently set up for this room.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {beds.map((bed) => (
                <BedCard
                    key={bed.id}
                    bed={bed}
                    onAllocate={onAllocate}
                    onVacate={onVacate}
                    onMaintenance={onMaintenance}
                    onMakeAvailable={onMakeAvailable}
                />
            ))}
        </div>
    );
}