import { Meal } from "../types/meal.types";

interface MealTableProps {
    meals: Meal[]
    loading?: boolean
    onEdit?: (meal: Meal) => void
    onDelete?: (mealId: string) => void
}

const mealTypeLabels: Record<Meal['mealType'], string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks'
}

const statusLabels: Record<Meal['status'], string> = {
    scheduled: 'Scheduled',
    served: 'Served',
    cancelled: 'Cancelled'
}

const statusClasses: Record<Meal['status'], string> = {
    scheduled: "bg-yellow-100 text-yellow-700",
    served: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700"
}

function formatDate(date: string) {
    if (!date) {
        return '-'
    }

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount)
}

export default function MealTable({ meals, loading = false, onEdit, onDelete }: MealTableProps) {
    if (loading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center p-6">
                <p className="text-sm text-gray-500">
                    Loading meals...
                </p>
            </div>
        )
    }

    if (meals.length === 0) {
        return (
            <div className="flex min-h-[200px] items-center justify-center p-6">
                <div className="text-center">
                    <h3 className="text-base font-semibold text-gray-900">
                        No meals found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        There are no meal records to display.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Date
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Meal
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Menu
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Amount
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Status
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                    {meals.map((meal) => (
                        <tr
                            key={meal.id}
                            className="hover:bg-gray-50"
                        >
                            {/* Date */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                {formatDate(
                                    meal.mealDate
                                )}
                            </td>

                            {/* Meal Type */}
                            <td className="whitespace-nowrap px-6 py-4">
                                <span className="text-sm font-medium text-gray-900">
                                    {
                                        mealTypeLabels[
                                        meal.mealType
                                        ]
                                    }
                                </span>
                            </td>

                            {/* Menu */}
                            <td className="max-w-xs px-6 py-4">
                                <p className="truncate text-sm text-gray-700">
                                    {meal.menu}
                                </p>

                                {meal.description && (
                                    <p className="mt-1 truncate text-xs text-gray-400">
                                        {meal.description}
                                    </p>
                                )}
                            </td>

                            {/* Amount */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {formatAmount(
                                    meal.amount
                                )}
                            </td>

                            {/* Status */}
                            <td className="whitespace-nowrap px-6 py-4">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses[meal.status]}`}
                                >
                                    {
                                        statusLabels[
                                        meal.status
                                        ]
                                    }
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEdit(
                                                    meal
                                                )
                                            }
                                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {onDelete && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDelete(
                                                    meal.id
                                                )
                                            }
                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}