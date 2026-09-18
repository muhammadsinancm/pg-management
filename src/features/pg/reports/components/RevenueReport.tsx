import { Wallet } from "lucide-react";
import type { RevenueReportData } from "../types/report.types";

interface RevenueReportProps {
    revenue: RevenueReportData;
}

export function RevenueReport({ revenue }: RevenueReportProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100/90 text-neutral-700">
                        <Wallet className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-neutral-700" />
                    </div>
                    <div>
                        <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                            Revenue Report
                        </h2>
                        <p className="text-[10px] sm:text-[11px] text-neutral-400">
                            Breakdown of collected earnings
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-base sm:text-lg font-bold leading-none tracking-tight text-neutral-900">
                        ₹{revenue.totalRevenue.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-neutral-400">
                        Total Collected
                    </p>
                </div>
            </div>

            {/* Breakdown List */}
            <div className="divide-y divide-neutral-100 px-3.5 sm:px-4 py-1.5">
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
    );
}

interface RevenueItemProps {
    label: string;
    value: number;
}

function RevenueItem({ label, value }: RevenueItemProps) {
    return (
        <div className="flex items-center justify-between py-2.5 transition-colors">
            <span className="text-xs font-medium text-neutral-600">
                {label}
            </span>

            <strong className="text-xs sm:text-sm font-bold text-neutral-900">
                ₹{value.toLocaleString("en-IN")}
            </strong>
        </div>
    );
}