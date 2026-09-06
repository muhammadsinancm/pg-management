import { Meal } from "../types/meal.types";

interface MealSummaryProps {
    meals: Meal[]
}

export default function MealSummaray({ meals }: MealSummaryProps) {
    const totalMeals = meals.length

    const scheduledMeals = meals.filter((meal) => meal.status === 'scheduled').length
    const servedMeals = meals.filter((meal) => meal.status === 'served').length
    const cancelledMeals = meals.filter((meal) => meal.status === 'cancelled').length

    const totalAmount = meals.reduce((total, meal) => total + meal.amount, 0)

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(amount)
    }

    const summaryCards = [
        {
            title: 'Total Meals',
            value: totalMeals
        },
        {
            title: 'Scheduled',
            value: scheduledMeals
        },
        {
            title: 'Served',
            value: servedMeals
        },
        {
            title: 'Cancelled',
            value: cancelledMeals
        },
        {
            title: 'Total Amount',
            value: formatAmount(totalAmount)
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {summaryCards.map((card) => (
                <div
                    key={card.title}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                    <p className="text-sm font-medium text-gray-500">
                        {card.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    )
}