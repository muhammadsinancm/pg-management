import { Bed } from "../types/bed.types";

interface BedCardProps {
  bed: Bed
  onAllocate: (bed: Bed) => void
  onVacate: (bed: Bed) => void
  onMaintenance: (bed: Bed) => void
  onMakeAvailable: (bed: Bed) => void
}

export function BedCard({ bed, onAllocate, onVacate, onMaintenance, onMakeAvailable }: BedCardProps) {

  const statusStyles = {
    available: 'border-emerald-200 bg-emerald-50',
    occupied: 'border-blue-200 bg-blue-50',
    maintenance: 'border-amber-200 bg-amber-50'
  }

  return (
    <div
      className={`rounded-lg border p-4 ${statusStyles[bed.status]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Bed
          </p>

          <h4 className="text-lg font-semibold">
            {bed.bedNumber}
          </h4>
        </div>

        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium capitalize">
          {bed.status}
        </span>
      </div>

      {bed.guestName && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">
            Guest
          </p>

          <p className="text-sm font-medium">
            {bed.guestName}
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">

    {/* AVAILABLE */}
    {bed.status === 'available' && (
        <>
            <button
                type="button"
                onClick={() => onAllocate(bed)}
                className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
            >
                Allocate
            </button>

            <button
                type="button"
                onClick={() => onMaintenance(bed)}
                className="rounded-md border px-3 py-2 text-xs font-medium"
            >
                Maintenance
            </button>
        </>
    )}

    {/* OCCUPIED */}
    {bed.status === 'occupied' && (
        <>
            <button
                type="button"
                onClick={() => onVacate(bed)}
                className="rounded-md border px-3 py-2 text-xs font-medium"
            >
                Vacate
            </button>

            <button
                type="button"
                onClick={() => onMaintenance(bed)}
                className="rounded-md border px-3 py-2 text-xs font-medium"
            >
                Maintenance
            </button>
        </>
    )}

    {/* MAINTENANCE */}
    {bed.status === 'maintenance' && (
        <button
            type="button"
            onClick={() => onMakeAvailable(bed)}
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
        >
            Make Available
        </button>
    )}

</div>
    </div>
  )
}