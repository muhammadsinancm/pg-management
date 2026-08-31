import { Bed } from "../types/bed.types";

interface VacateBedDialogProps {
    bed: Bed | null
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

export function VacateBedDialog({ bed, open, onClose, onConfirm }: VacateBedDialogProps) {

    if (!open || !bed) {
        return null
    }
    async function handleConfirm() {        
        await onConfirm()
        onClose()
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
                <h2 className="text-lg font-semibold">
                    Vacate Bed
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Are you sure you want to vacate bed{' '}
                    <strong>{bed.bedNumber}</strong>?
                </p>

                {bed.customerName && (
                    <p className="mt-2 text-sm">
                        Customer:{' '}
                        <strong>
                            {bed.customerName}
                        </strong>
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground"
                    >
                        Vacate
                    </button>
                </div>
            </div>
        </div>
    )
}