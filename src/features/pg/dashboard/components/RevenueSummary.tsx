import { ArrowDown, ArrowUp, CreditCard, Wallet } from "lucide-react";
import type { RevenueData } from "./dashboard.types";

interface RevenueSummaryProps {
    revenue: RevenueData;
}

const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

export default function RevenueSummary({ revenue }: RevenueSummaryProps) {
    return (
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xs">
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-neutral-100 px-3.5 py-2.5 sm:px-4 sm:py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                    <Wallet className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                        Income & Expense
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-neutral-400">
                        Financial overview
                    </p>
                </div>
            </div>

            {/* Financial Columns */}
            <div className="grid grid-cols-3 divide-x divide-neutral-100">
                {/* Income */}
                <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-neutral-600">
                            Income
                        </span>
                        <ArrowUp className="h-3.5 w-3.5 text-neutral-400" />
                    </div>
                    <p className="mt-1 text-base sm:text-lg font-bold tracking-tight text-neutral-900">
                        {formatCurrency(revenue.income)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-neutral-400">
                        Collected
                    </p>
                </div>

                {/* Expenses */}
                <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-neutral-600">
                            Expenses
                        </span>
                        <ArrowDown className="h-3.5 w-3.5 text-neutral-400" />
                    </div>
                    <p className="mt-1 text-base sm:text-lg font-bold tracking-tight text-neutral-900">
                        {formatCurrency(revenue.expenses)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-neutral-400">
                        Spending
                    </p>
                </div>

                {/* Net Income */}
                <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-neutral-600">
                            Net Income
                        </span>
                        <CreditCard className="h-3.5 w-3.5 text-neutral-400" />
                    </div>
                    <p className="mt-1 text-base sm:text-lg font-bold tracking-tight text-neutral-900">
                        {formatCurrency(revenue.netIncome)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-neutral-400">
                        After expenses
                    </p>
                </div>
            </div>
        </div>
    );
}