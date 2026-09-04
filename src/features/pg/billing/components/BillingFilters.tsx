import { BillingCycle, BillingStatus } from "../types/billing.types";

interface BillingFiltersProps {
    billingCycle: BillingCycle | 'all'
    status: BillingStatus | 'all'
    search: string
    onBillingCycleChange: (value: BillingCycle | 'all') => void
    onStatusChange: (value: BillingStatus | 'all') => void
    onSearchChange: (value: string) => void
    onReset: () => void
}

export function BillingFilters({billingCycle, status, search, onBillingCycleChange, onStatusChange, onReset, onSearchChange}: BillingFiltersProps) {
    return (
        <div className="rounded-lg border bg-white p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                {/* Search */}
                <div>
                    <label
                        htmlFor="billing-search"
                        className="mb-1 block text-sm font-medium"
                    >
                        Search
                    </label>

                    <input
                        id="billing-search"
                        type="text"
                        value={search}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder="Search customer or billing..."
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>

                {/* Billing Cycle */}
                <div>
                    <label
                        htmlFor="billing-cycle"
                        className="mb-1 block text-sm font-medium"
                    >
                        Billing Cycle
                    </label>

                    <select
                        id="billing-cycle"
                        value={billingCycle}
                        onChange={(e) =>
                            onBillingCycleChange(
                                e.target.value as BillingCycle | "all"
                            )
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    >
                        <option value="all">
                            All Cycles
                        </option>

                        <option value="daily">
                            Daily
                        </option>

                        <option value="weekly">
                            Weekly
                        </option>

                        <option value="monthly">
                            Monthly
                        </option>

                        <option value="custom">
                            Custom
                        </option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label
                        htmlFor="billing-status"
                        className="mb-1 block text-sm font-medium"
                    >
                        Status
                    </label>

                    <select
                        id="billing-status"
                        value={status}
                        onChange={(e) =>
                            onStatusChange(
                                e.target.value as BillingStatus | "all"
                            )
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                    >
                        <option value="all">
                            All Status
                        </option>

                        <option value="draft">
                            Draft
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="paid">
                            Paid
                        </option>

                        <option value="partial">
                            Partial
                        </option>

                        <option value="overdue">
                            Overdue
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={onReset}
                        className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    )
}