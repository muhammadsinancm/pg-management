import { Bed } from "../types/bed.types";
import { BedCard } from "./BedCard";

interface BedListProps {
    beds: Bed[]
    onAllocate: (bed: Bed) => void
    onVacate: (bed: Bed) => void
    onMaintenance: (bed: Bed) => void
    onMakeAvailable: (bed: Bed) => void
}

export function BedList({ beds, onAllocate, onVacate, onMaintenance, onMakeAvailable }: BedListProps) {
    if (!beds.length) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    No beds configured for this room.
                </p>
            </div>
        )
    }
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

    )
}