import React, { useState } from "react";
import { Bed } from "../types/bed.types";

interface RoomTransferProps {
    sourceBed: Bed | null
    availableBeds: Bed[]
    open: boolean
    onClose: () => void
    onTransfer: (sourceBed: Bed, targetBed: Bed) => Promise<void>
}

export function RoomTransfer({ sourceBed, availableBeds, open, onClose, onTransfer }: RoomTransferProps): React.JSX.Element | null {
    const [targetId, setTargetId] = useState('')
    const [loading, setLoading] = useState(false)

    if (!open || !sourceBed) {
        return null
    }

    const currentSourceBed = sourceBed

    async function handleTransfer() {

        const target = availableBeds.find((bed) => bed.id === targetId)

        if (!target) {
            return
        }

        try {
            setLoading(true)

            await onTransfer(currentSourceBed, target)
            setTargetId('')
            onClose()

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
                <h2 className="text-lg font-semibold">
                    Transfer Customer
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Current bed:{' '}
                    <strong>
                        {sourceBed.bedNumber}
                    </strong>
                </p>

                <div className="mt-5">
                    <label className="mb-1 block text-sm font-medium">
                        Target bed
                    </label>

                    <select
                        value={targetId}
                        onChange={(event) =>
                            setTargetId(
                                event.target.value
                            )
                        }
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        <option value="">
                            Select bed
                        </option>

                        {availableBeds.map(
                            (bed) => (
                                <option
                                    key={bed.id}
                                    value={bed.id}
                                >
                                    Bed {bed.bedNumber}
                                </option>
                            )
                        )}
                    </select>
                </div>

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
                        disabled={
                            !targetId || loading
                        }
                        onClick={
                            handleTransfer
                        }
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                    >
                        {loading
                            ? 'Transferring...'
                            : 'Transfer'}
                    </button>
                </div>
            </div>
        </div>
    )
}