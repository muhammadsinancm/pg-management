import { MealStatus, MealType } from "../types/meal.types";

interface MealFiltersProps {
    mealType: MealType | 'all'
    status: MealStatus | 'all'
    date: string
    onMealTypeChange: (value: MealType | 'all') => void
    onStatusChange: (value: MealStatus | 'all') => void
    onDateChange: (value: string) => void
    onClear: () => void
}

export default function MealFilters({ mealType, status, date, onMealTypeChange, onStatusChange, onDateChange, onClear }: MealFiltersProps) {
    const hasFilters = mealType !== 'all' || status !== 'all' || date !== ''

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Meal Type */}
                <div>
                    <label
                        htmlFor="mealType"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Meal Type
                    </label>

                    <select
                        id="mealType"
                        value={mealType}
                        onChange={(e) =>
                            onMealTypeChange(
                                e.target.value as MealType | "all"
                            )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="all">All Types</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snacks">Snacks</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label
                        htmlFor="status"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(e) =>
                            onStatusChange(
                                e.target.value as MealStatus | "all"
                            )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="served">Served</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label
                        htmlFor="mealDate"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Date
                    </label>

                    <input
                        id="mealDate"
                        type="date"
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                {/* Clear */}
                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!hasFilters}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    )

}