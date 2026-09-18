import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
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

function ReportsContentSkeleton(): React.JSX.Element {
    return (
        <div className="w-full space-y-2.5 sm:space-y-3 animate-pulse">
            {/* 7 Stat Cards Skeletons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex min-h-[76px] sm:min-h-[82px] items-center justify-between rounded-2xl border border-neutral-100 bg-white px-3.5 py-2.5 shadow-2xs sm:px-4 sm:py-3"
                    >
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="h-3 w-16 sm:w-20 rounded bg-neutral-100" />
                            <div className="h-5 sm:h-6 w-12 sm:w-16 rounded-md bg-neutral-200" />
                        </div>
                        <div className="ml-2.5 h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-neutral-100 shrink-0" />
                    </div>
                ))}
            </div>

            {/* Report Blocks Skeletons */}
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 shadow-2xs space-y-3"
                    >
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <div className="space-y-1">
                                <div className="h-4 w-32 rounded bg-neutral-200" />
                                <div className="h-2.5 w-24 rounded bg-neutral-100" />
                            </div>
                            <div className="h-5 w-16 rounded bg-neutral-200" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <div key={j} className="h-16 rounded-xl bg-neutral-50 p-2.5 space-y-1">
                                    <div className="h-2.5 w-10 rounded bg-neutral-100" />
                                    <div className="h-4 w-12 rounded bg-neutral-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ReportsPage() {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const { reports, loading, error, refresh } = useReports({ startDate, endDate });

    const handleFilterChange = (start?: Date, end?: Date) => {
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <div className="w-full space-y-2.5 sm:space-y-3">
            {/* Header with integrated Refresh */}
            <ReportHeader
                title="Reports"
                description="View your PG performance and financial reports."
                onRefresh={refresh}
                loading={loading}
            />

            {/* Search Filters - Always visible on the first (top), never unmounts */}
            <ReportFilters
                onFilterChange={handleFilterChange}
                initialStartDate={startDate}
                initialEndDate={endDate}
                loading={loading}
            />

            {/* Error banner if fetch fails */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-bold text-red-900">
                                Failed to load reports
                            </h2>
                            <p className="mt-1 text-xs text-red-700">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={refresh}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content: Show skeleton during initial loading, or reports with smooth transitions */}
            {loading && !reports ? (
                <ReportsContentSkeleton />
            ) : reports ? (
                <div
                    className={cn(
                        "space-y-2.5 sm:space-y-3 transition-opacity duration-200",
                        loading && "opacity-60 pointer-events-none"
                    )}
                >
                    {/* Summary Stat Cards */}
                    <ReportSummary summary={reports.summary} />

                    {/* Financial Reports */}
                    <div className="space-y-1.5">
                        <div className="px-0.5">
                            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900">
                                Financial Reports
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-neutral-400">
                                Revenue and income distributions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-2">
                            <RevenueReport revenue={reports.revenue} />
                            <IncomeReport income={reports.income} />
                        </div>
                    </div>

                    {/* Occupancy Overview with Graph */}
                    <div className="space-y-1.5">
                        <div className="px-0.5">
                            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900">
                                Occupancy Overview
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-neutral-400">
                                Real-time bed and room utilization with visual graph
                            </p>
                        </div>

                        <OccupancyReport occupancy={reports.occupancy} />
                    </div>

                    {/* Booking & Payment */}
                    <div className="space-y-1.5">
                        <div className="px-0.5">
                            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900">
                                Booking & Payment Reports
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-neutral-400">
                                Guest reservations and collections
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-2">
                            <BookingReport bookings={reports.bookings} />
                            <PaymentReport payments={reports.payments} />
                        </div>
                    </div>

                    {/* Meal & Expense Reports */}
                    <div className="space-y-1.5">
                        <div className="px-0.5">
                            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900">
                                Operations & Expenses
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-neutral-400">
                                Dining counts and operational expenditures
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-2">
                            <MealReport meals={reports.meals} />
                            <ExpenseReport expenses={reports.expenses} />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}