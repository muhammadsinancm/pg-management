import { Bed } from "../types/bed.types";

interface BedCardProps {
    bed: Bed
    onAllocate: (bed: Bed) => void
    onVacate: (bed: Bed) => void
    onMaintenance: (bed: Bed) => void
}

export function BedCard({bed, onAllocate, onVacate, onMaintenance}: BedCardProps) {

    const statusStyles = {
        available: 'border-emerald-200 bg-emerald-50',
        occupied: 'border-blue-200 bg-blue-50',
        maintenance: 'border-amber-200 bg-amber-50'
    }

    return(
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

      {bed.customerName && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">
            Customer
          </p>

          <p className="text-sm font-medium">
            {bed.customerName}
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {bed.status === 'available' && (
          <button
            type="button"
            onClick={() =>
              onAllocate(bed)
            }
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            Allocate
          </button>
        )}

        {bed.status === 'occupied' && (
          <button
            type="button"
            onClick={() =>
              onVacate(bed)
            }
            className="rounded-md border px-3 py-2 text-xs font-medium"
          >
            Vacate
          </button>
        )}

        {bed.status !== 'maintenance' && (
          <button
            type="button"
            onClick={() =>
              onMaintenance(bed)
            }
            className="rounded-md border px-3 py-2 text-xs font-medium"
          >
            Maintenance
          </button>
        )}
      </div>
    </div>
    )
}