import { ExpenseCategory, ExpenseStatus } from "../types/expense.types"

interface ExpenseFiltersProps {
    search: string
    category: ExpenseCategory | 'all'
    status: ExpenseStatus | 'all'
    onSearchChange: (value: string) => void
    onCategoryChange: (value: ExpenseCategory | 'all') => void
    onStatusChange: (value: ExpenseStatus | 'all') => void
    onClear?: () => void
}

const categories: ExpenseCategory[] = [
    'electricity',
    'water',
    'internet',
    'maintenance',
    'food',
    'cleaning',
    'salary',
    'rent',
    'supplies',
    'ohter'
]

const statuses: ExpenseStatus[] = [
    'pending',
    'paid',
    'cancelled'
]

function formatLabel(value: string) {
    return value.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function ExpenseFilters({ search, category, status, onSearchChange, onCategoryChange, onStatusChange, onClear }: ExpenseFiltersProps) {
    const hasFilters = search.trim() !== '' || category !== 'all' || status !== 'all'

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                {/* Search */}

                <div className="lg:col-span-2">
                    <label
                        htmlFor="expense-search"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Search
                    </label>

                    <input
                        id="expense-search"
                        type="text"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search by description or reference..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                    />
                </div>

                {/* Category */}

                <div>
                    <label
                        htmlFor="expense-category"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Category
                    </label>

                    <select
                        id="expense-category"
                        value={category}
                        onChange={(event) =>
                            onCategoryChange(
                                event.target.value as
                                | ExpenseCategory
                                | "all"
                            )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                    >
                        <option value="all">
                            All Categories
                        </option>

                        {categories.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {formatLabel(item)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}

                <div>
                    <label
                        htmlFor="expense-status"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="expense-status"
                        value={status}
                        onChange={(event) =>
                            onStatusChange(
                                event.target.value as
                                | ExpenseStatus
                                | "all"
                            )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                    >
                        <option value="all">
                            All Statuses
                        </option>

                        {statuses.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {formatLabel(item)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Clear */}

            {hasFilters && onClear && (
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    )
}