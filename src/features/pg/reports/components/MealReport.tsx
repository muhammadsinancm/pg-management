import type { MealReportData } from "../types/report.types";

interface MealReportProps {
    meals: MealReportData
}

export function MealReport({ meals }: MealReportProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
                Meal Report
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

                <Stat
                    label="Total Meals"
                    value={meals.totalMeals}
                />

                <Stat
                    label="Breakfast"
                    value={meals.breakfast}
                />

                <Stat
                    label="Lunch"
                    value={meals.lunch}
                />

                <Stat
                    label="Dinner"
                    value={meals.dinner}
                />

                <Stat
                    label="Snacks"
                    value={meals.snacks}
                />

            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                    Total Meal Amount
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                    ₹{meals.totalAmount.toLocaleString("en-IN")}
                </p>
            </div>

        </section>
    )
}

interface StatProps {
    label: string
    value: number
}

function Stat({ label, value }: StatProps) {
    return (
        <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
                {value}
            </p>

        </div>
    )
}