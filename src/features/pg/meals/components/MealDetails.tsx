import { Meal } from "../types/meal.types";

interface MealDetailsProps {
    meal: Meal
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

function formatDateTime(date?: string) {
    if (!date) {
        return '-'
    }

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount)
}

export default function MealDetails({meal}: MealDetailsProps) {
    return (
    <div className="space-y-6">

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* Meal Type */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                        Meal Type
                    </p>

                    <p className="mt-2 text-xl font-semibold text-gray-900">
                        {mealTypeLabels[meal.mealType]}
                    </p>
                </div>

                {/* Amount */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                        Amount
                    </p>

                    <p className="mt-2 text-xl font-semibold text-gray-900">
                        {formatAmount(meal.amount)}
                    </p>
                </div>

                {/* Status */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                        Status
                    </p>

                    <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClasses[meal.status]}`}
                    >
                        {statusLabels[meal.status]}
                    </span>
                </div>
            </div>

            {/* Meal Information */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Meal Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Meal ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-900">
                            {meal.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Meal Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(meal.mealDate)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Meal Type
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {mealTypeLabels[meal.mealType]}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Amount
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatAmount(meal.amount)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Organization ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-900">
                            {meal.organizationId}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Branch ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-900">
                            {meal.branchId}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    Menu
                </h2>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-700">
                        {meal.menu || "-"}
                    </p>
                </div>
            </div>

            {/* Description */}
            {meal.description && (
                <div>
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                        Description
                    </h2>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="whitespace-pre-wrap text-sm text-gray-700">
                            {meal.description}
                        </p>
                    </div>
                </div>
            )}

            {/* Timestamps */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Record Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Created At
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDateTime(
                                meal.createdAt
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Updated At
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDateTime(
                                meal.updatedAt
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}