import { useState } from "react";
import { useReports } from "../hooks/useReports";
import { RevenueReport } from "../components/RevenueReport";
import { OccupancyReport } from "../components/OccupancyReport";
import { BookingReport } from "../components/BookingReport";
import { PaymentReport } from "../components/PaymentReport";
import { ReportSummaray } from "../components/ReportSummary";
import { ReportFilters } from "../components/ReportFilters";

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

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Reports
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View your PG performance and financial reports.
                    </p>

                </div>

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

            <ReportSummaray
                summary={reports.summary}
            />

            {/* Reports */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <RevenueReport
                    revenue={reports.revenue}
                />

                <OccupancyReport
                    occupancy={reports.occupancy}
                />

                <BookingReport
                    bookings={reports.bookings}
                />

                <PaymentReport
                    payments={reports.payments}
                />

            </div>

        </div>

    )

}