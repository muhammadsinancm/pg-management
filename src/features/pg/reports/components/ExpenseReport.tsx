import type { ExpenseReportData } from "../types/report.types";

interface ExpenseReportProps {
    expenses: ExpenseReportData
}

export function ExpenseReport({ expenses }: ExpenseReportProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">
                    Expense Report
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Overview of expenses and their payment status.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                        Total Expenses
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {expenses.totalExpenses}
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                        Paid Expenses
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {expenses.paidExpenses}
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                        Pending Expenses
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {expenses.pendingExpenses}
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                        Cancelled Expenses
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {expenses.cancelledExpenses}
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2 lg:col-span-2">
                    <p className="text-sm text-gray-500">
                        Total Expense Amount
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        ₹{expenses.totalAmount.toLocaleString("en-IN")}
                    </p>
                </div>

            </div>
        </div>
    )
}