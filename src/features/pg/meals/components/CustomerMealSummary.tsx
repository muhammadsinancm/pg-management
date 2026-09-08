import { CustomerMeal } from "../types/meal.types";

interface CustomerMealSummaryProps {
    meals: CustomerMeal[];
}

export function CustomerMealSummary({ meals }: CustomerMealSummaryProps) {
    const totalMeals = meals.length

    const servedMeals = meals.filter((meal) => meal.status === 'served').length
    const cancelledMeals = meals.filter((meal) => meal.status === 'cancelled').length

    const totalAmount = meals.filter((meal) => meal.status === 'served')
        .reduce((total, meal) => total + Number(meal.amount || 0), 0)

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">
                    Total Meals
                </p>

                <p className="mt-1 text-2xl font-semibold">
                    {totalMeals}
                </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">
                    Served
                </p>

                <p className="mt-1 text-2xl font-semibold text-green-600">
                    {servedMeals}
                </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">
                    Cancelled
                </p>

                <p className="mt-1 text-2xl font-semibold text-red-600">
                    {cancelledMeals}
                </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-500">
                    Total Amount
                </p>

                <p className="mt-1 text-2xl font-semibold">
                    ₹{totalAmount.toFixed(2)}
                </p>
            </div>
        </div>
    );
}