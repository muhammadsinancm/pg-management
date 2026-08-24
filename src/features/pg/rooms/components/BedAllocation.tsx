import { useState } from "react";
import { Bed } from "../types/bed.types";

interface BedAllocationProps {
    bed: Bed | null
    open: boolean
    onClose: () => void
    onSubmit: (customerId: string, customerName: string) => Promise<void>
}

export function BedAllocation({ bed, open, onClose, onSubmit }: BedAllocationProps) {

    const [customerId, setCustomerId] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [loading, setLoading] = useState(false)

    if (!open || !bed) {
        return null
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        if (!customerId.trim()) {
            return
        }
        if (!customerName.trim()) {
            return
        }

        try {

            setLoading(true)

            await onSubmit(customerId.trim(), customerName.trim())

            setCustomerId('')
            setCustomerName('')
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
                <div className="mb-5">
                    <h2 className="text-lg font-semibold">
                        Allocate Bed {bed.bedNumber}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Assign a customer to this bed.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Customer ID
                        </label>

                        <input
                            value={customerId}
                            onChange={(event) =>
                                setCustomerId(
                                    event.target.value
                                )
                            }
                            placeholder="Customer ID"
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Customer name
                        </label>

                        <input
                            value={customerName}
                            onChange={(event) =>
                                setCustomerName(
                                    event.target.value
                                )
                            }
                            placeholder="Customer name"
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                        >
                            {loading
                                ? 'Allocating...'
                                : 'Allocate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )

}