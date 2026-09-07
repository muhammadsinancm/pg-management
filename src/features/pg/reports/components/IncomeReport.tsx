import type { IncomeReportData } from "../types/report.types";

interface IncomeReportProps {
    income: IncomeReportData
}

export function IncomeReport({income}: IncomeReportProps) {
return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
                Income Report
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                <Stat
                    label="Total Income"
                    value={income.totalIncome}
                />

                <Stat
                    label="Rent Income"
                    value={income.rentIncome}
                />

                <Stat
                    label="Meal Income"
                    value={income.mealIncome}
                />

                <Stat
                    label="Other Income"
                    value={income.otherIncome}
                />

            </div>

        </section>
    )
}

interface StatProps {
    label: string
    value: number
}

function Stat({label, value}: StatProps) {
     return (
        <div className="rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
                ₹{value.toLocaleString("en-IN")}
            </p>

        </div>
    )
}