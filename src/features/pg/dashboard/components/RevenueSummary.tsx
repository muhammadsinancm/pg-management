import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { RevenueData } from "../types/dahsboard.types";

interface RevenueSummaryProps {
    revenue: RevenueData
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

export default function RevenueSummary({revenue}: RevenueSummaryProps) {
return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Income & Expense
                </h2>

                <p className="text-sm text-gray-500">
                    Overall financial summary
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ArrowUp className="h-4 w-4" />
                        Income
                    </div>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                        {formatCurrency(revenue.income)}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ArrowDown className="h-4 w-4" />
                        Expenses
                    </div>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                        {formatCurrency(revenue.expenses)}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Wallet className="h-4 w-4" />
                        Net Income
                    </div>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                        {formatCurrency(revenue.netIncome)}
                    </p>
                </div>
            </div>
        </div>
    )
}