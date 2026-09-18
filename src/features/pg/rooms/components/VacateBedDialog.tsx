import { LogOut, X } from "lucide-react";
import type { Bed } from "../types/bed.types";

interface VacateBedDialogProps {
    bed: Bed | null;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function VacateBedDialog({
    bed,
    open,
    onClose,
    onConfirm,
}: VacateBedDialogProps) {
    if (!open || !bed) {
        return null;
    }

    async function handleConfirm() {
        await onConfirm();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-2xl space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-neutral-900">
                                Vacate Bed {bed.bedNumber}
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Confirm checkout and vacate resident
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 text-xs space-y-1">
                    <p className="text-neutral-600">
                        Are you sure you want to vacate this bed? The bed status will be returned to Available.
                    </p>
                    {bed.guestName && (
                        <p className="font-semibold text-neutral-900 pt-1">
                            Current Resident: <span className="font-bold">{bed.guestName}</span>
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 transition-colors cursor-pointer"
                    >
                        Confirm Vacate
                    </button>
                </div>
            </div>
        </div>
    );
}