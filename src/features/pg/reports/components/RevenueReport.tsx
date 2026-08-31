import { RevenueReportData } from "../types/report.types";

interface RevenueReportProps {
    revenue: RevenueReportData
}

export function RevenueReport({ revenue }: RevenueReportProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
                Revenue Report
            </h2>

            <div className="mt-5 space-y-4">

                <RevenueItem
                    label="Total Revenue"
                    value={revenue.totalRevenue}
                />

                <RevenueItem
                    label="Rent"
                    value={revenue.rentRevenue}
                />

                <RevenueItem
                    label="Advance"
                    value={revenue.advanceRevenue}
                />

                <RevenueItem
                    label="Deposit"
                    value={revenue.depositRevenue}
                />

                <RevenueItem
                    label="Other"
                    value={revenue.otherRevenue}
                />

            </div>
        </section>
    )
}

interface RevenueItemProps {
    label: string
    value: number
}

function RevenueItem({ label, value }: RevenueItemProps) {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">

            <span className="text-sm text-gray-600">
                {label}
            </span>

            <strong className="text-gray-900">
                ₹{value.toLocaleString("en-IN")}
            </strong>

        </div>

    )
}