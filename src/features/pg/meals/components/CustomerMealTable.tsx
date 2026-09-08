import { CustomerMeal } from "../types/meal.types";

interface CustomerMealTableProps {
    meals: CustomerMeal[];
    loading: boolean
    onCancel?: (mealId: string) => void;
    onDelete?: (mealId: string) => void;
}

export function CustomerMealTable({ meals, onCancel, onDelete, loading = false }: CustomerMealTableProps) {
    if (meals.length === 0) {
        return (
            <div className="rounded-lg border p-6 text-center text-gray-500">
                No customer meals found.
            </div>
        );
    }

    if (loading) {
         return (
            <div className="rounded-lg border p-6 text-center text-gray-500">
                Loading meals...
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[800px] text-sm">
                <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium">
                            Date
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Meal
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Amount
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Status
                        </th>

                        <th className="px-4 py-3 text-right font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {meals.map((meal) => (
                        <tr key={meal.id}>
                            <td className="px-4 py-3">
                                {meal.mealDate}
                            </td>

                            <td className="px-4 py-3 capitalize">
                                {meal.mealType}
                            </td>

                            <td className="px-4 py-3">
                                ₹{meal.amount.toFixed(2)}
                            </td>

                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${meal.status === "served"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {meal.status}
                                </span>
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    {meal.status === "served" &&
                                        onCancel && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onCancel(meal.id)
                                                }
                                                className="rounded-md border border-yellow-300 px-3 py-1.5 text-yellow-700 hover:bg-yellow-50"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                    {onDelete && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDelete(meal.id)
                                            }
                                            className="rounded-md border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50"
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
    );
}