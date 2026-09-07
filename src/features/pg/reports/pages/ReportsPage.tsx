import { useState } from "react";
import { useReports } from "../hooks/useReports";
import { RevenueReport } from "../components/RevenueReport";
import { OccupancyReport } from "../components/OccupancyReport";
import { BookingReport } from "../components/BookingReport";
import { PaymentReport } from "../components/PaymentReport";
import { ReportFilters } from "../components/ReportFilters";
import { ReportHeader } from "../components/ReportHeader";
import { ReportSummary } from "../components/ReportSummary";
import { MealReport } from "../components/MealReport";
import { IncomeReport } from "../components/IncomeReport";
import { ExpenseReport } from "../components/ExpenseReport";

export function ReportsPage() {
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const { reports, loading, error, refresh } = useReports({ startDate, endDate })

    const handleFilterChange = (start?: Date, end?: Date) => {
        setStartDate(start)
        setEndDate(end)
    }

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-sm text-gray-500">
                    Loading reports...
                </div>

            </div>

        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">

                <h2 className="font-semibold text-red-800">
                    Failed to load reports
                </h2>

                <p className="mt-2 text-sm text-red-700">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={refresh}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Try Again
                </button>

            </div>

        )
    }

    if (!reports) {
        return null
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <ReportHeader
                title="Reports"
                description="View your PG performance and financial reports."
            />

            {/* Refresh */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={refresh}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <ReportFilters
                onFilterChange={handleFilterChange}
            />

            {/* Summary */}
            <ReportSummary
                summary={reports.summary}
            />

            {/* Financial Reports */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Financial Reports
                </h2>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <RevenueReport
                        revenue={reports.revenue}
                    />

                    <IncomeReport
                        income={reports.income}
                    />
                </div>
            </div>

            {/* Occupancy */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Occupancy Report
                </h2>

                <OccupancyReport
                    occupancy={reports.occupancy}
                />
            </div>

            {/* Booking & Payment */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Booking & Payment Reports
                </h2>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <BookingReport
                        bookings={reports.bookings}
                    />

                    <PaymentReport
                        payments={reports.payments}
                    />
                </div>
            </div>

                        <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Meal Report
                </h2>

                <MealReport
                    meals={reports.meals}
                />
            </div>

            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Expense Report
                </h2>

                <ExpenseReport
                    expenses={reports.expenses}
                />
            </div>

        </div>
    )

}