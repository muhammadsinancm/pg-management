import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import type { Bed } from "../types/bed.types";

interface BedAllocationProps {
    bed: Bed | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (guestId: string, guestName: string) => Promise<void>;
}

export function BedAllocation({ bed, open, onClose, onSubmit }: BedAllocationProps) {
    const [guestId, setGuestId] = useState("");
    const [guestName, setCustomerName] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open || !bed) {
        return null;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!guestId.trim() || !guestName.trim()) {
            return;
        }

        try {
            setLoading(true);
            await onSubmit(guestId.trim(), guestName.trim());
            setGuestId("");
            setCustomerName("");
            onClose();
        } catch (error) {
            console.error("Allocation error", error);
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
                            <UserPlus className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-neutral-900">
                                Allocate Bed {bed.bedNumber}
                            </h2>
                            <p className="text-xs text-neutral-400">
                                Assign a resident to this bed
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

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-neutral-700">
                            Customer / Resident ID
                        </label>
                        <input
                            value={guestId}
                            onChange={(event) => setGuestId(event.target.value)}
                            placeholder="e.g. CUST-101"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-neutral-700">
                            Resident Full Name
                        </label>
                        <input
                            value={guestName}
                            onChange={(event) => setCustomerName(event.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !guestId.trim() || !guestName.trim()}
                            className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            {loading ? "Allocating..." : "Confirm Allocation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}