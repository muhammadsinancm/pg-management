import { TrendingUp } from "lucide-react";
import type { IncomeReportData } from "../types/report.types";

interface IncomeReportProps {
    income: IncomeReportData;
}

export function IncomeReport({ income }: IncomeReportProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100/90 text-neutral-700">
                        <TrendingUp className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-neutral-700" />
                    </div>
                    <div>
                        <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                            Income Report
                        </h2>
                        <p className="text-[10px] sm:text-[11px] text-neutral-400">
                            Summary of all income channels
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-base sm:text-lg font-bold leading-none tracking-tight text-neutral-900">
                        ₹{income.totalIncome.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-neutral-400">
                        Total Income
                    </p>
                </div>
            </div>

            {/* Stat Tiles Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 p-3.5 sm:p-4 sm:grid-cols-2 lg:grid-cols-4">
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
    );
}

interface StatProps {
    label: string;
    value: number;
}

function Stat({ label, value }: StatProps) {
    return (
        <div className="rounded-xl bg-neutral-50/80 border border-neutral-100/80 p-3 transition-all hover:bg-neutral-50">
            <p className="text-[11px] font-medium text-neutral-500 truncate">
                {label}
            </p>

            <p className="mt-1 text-base sm:text-lg font-bold tracking-tight text-neutral-900 truncate">
                ₹{value.toLocaleString("en-IN")}
            </p>
        </div>
    );
}