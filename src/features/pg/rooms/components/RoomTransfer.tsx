import React, { useState } from "react";
import { ArrowRightLeft, X } from "lucide-react";
import type { Bed } from "../types/bed.types";

interface RoomTransferProps {
    sourceBed: Bed | null;
    availableBeds: Bed[];
    open: boolean;
    onClose: () => void;
    onTransfer: (sourceBed: Bed, targetBed: Bed) => Promise<void>;
}

export function RoomTransfer({
    sourceBed,
    availableBeds,
    open,
    onClose,
    onTransfer,
}: RoomTransferProps): React.JSX.Element | null {
    const [targetId, setTargetId] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open || !sourceBed) {
        return null;
    }

    const currentSourceBed = sourceBed;

    async function handleTransfer() {
        const target = availableBeds.find((bed) => bed.id === targetId);
        if (!target) return;

        try {
            setLoading(true);
            await onTransfer(currentSourceBed, target);
            setTargetId("");
            onClose();
        } catch (error) {
            console.error("Transfer error", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-2xl space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                            <ArrowRightLeft className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-neutral-900">
                                Transfer Resident
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Relocate resident from bed {sourceBed.bedNumber}
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

                {/* Info Card */}
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 text-xs space-y-1">
                    <p className="text-neutral-500">
                        Current Bed: <span className="font-bold text-neutral-900">{sourceBed.bedNumber}</span>
                    </p>
                    {sourceBed.guestName && (
                        <p className="text-neutral-500">
                            Resident: <span className="font-bold text-neutral-900">{sourceBed.guestName}</span>
                        </p>
                    )}
                </div>

                {/* Target Bed Selector */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-700">
                        Destination Bed
                    </label>
                    <select
                        value={targetId}
                        onChange={(event) => setTargetId(event.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    >
                        <option value="">Choose an available bed</option>
                        {availableBeds.map((bed) => (
                            <option key={bed.id} value={bed.id}>
                                Bed {bed.bedNumber} (Available)
                            </option>
                        ))}
                    </select>
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
                        disabled={!targetId || loading}
                        onClick={handleTransfer}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
                    >
                        {loading ? "Transferring..." : "Confirm Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
}